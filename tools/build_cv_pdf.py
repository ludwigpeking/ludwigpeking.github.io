"""Build one-page PDF CVs from cv.html and cv-zh.html.

Reads the live CV pages, lays them out on a single printed page (portrait and
contacts in a header, all sections flowing through two balanced columns),
picks the largest type size that still fits on one page, and prints through
headless Chrome so every link stays clickable.

Usage (from the site root):
    python tools/build_cv_pdf.py [path/to/portrait.jpg]
"""

import base64
import html
import io
import re
import sys
from pathlib import Path

import fitz  # PyMuPDF, used only to verify the result
from PIL import Image
from playwright.sync_api import sync_playwright

SITE_ROOT = Path(__file__).resolve().parent.parent
SITE_URL = "https://ludwigpeking.github.io/"
DEFAULT_PORTRAIT_PATH = Path.home() / "Pictures" / "portrait.jpg"

# Crop box of the portrait in source pixels (left, top, right, bottom):
# head and shoulders, cut from the 1279 x 1600 studio shot.
PORTRAIT_CROP_BOX = (260, 170, 1020, 1120)
PORTRAIT_OUTPUT_WIDTH_PIXELS = 480

CSS_PIXELS_PER_INCH = 96
PAGE_MARGIN_INCHES = 0.45
SMALLEST_FONT_SIZE_POINTS = 6.0
LARGEST_FONT_SIZE_POINTS = 11.0

CV_VARIANTS = [
    {
        "source_file": "cv.html",
        "output_file": "cv-richard-qian-li.pdf",
        "paper_format": "Letter",
        "paper_width_inches": 8.5,
        "paper_height_inches": 11.0,
        "email_label": "Email",
    },
    {
        "source_file": "cv-zh.html",
        "output_file": "cv-richard-qian-li-zh.pdf",
        "paper_format": "A4",
        "paper_width_inches": 8.27,
        "paper_height_inches": 11.69,
        "email_label": "邮箱",
    },
]

PRINT_STYLESHEET = """
@page { size: __PAPER_FORMAT__; margin: 0; }
* { box-sizing: border-box; }
html { font-size: 9pt; }
body {
  margin: 0;
  font-family: "IBM Plex Sans", "Noto Sans SC", "Microsoft YaHei", Arial, sans-serif;
  color: #17161a;
  line-height: 1.36;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
/* Links read as ordinary text; a faint underline marks them as clickable. */
a {
  color: inherit;
  text-decoration: underline;
  text-decoration-color: #c4c0b8;
  text-decoration-thickness: 0.5pt;
  text-underline-offset: 0.15em;
}
strong { font-weight: 600; }
.sheet { width: __PAPER_WIDTH__in; padding: __MARGIN__in; }

.header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0 0.28in;
  align-items: center;
  padding-bottom: 0;
  margin-bottom: 0.9rem;
}
.portrait { display: block; height: 10.5rem; border-radius: 4px; }
h1 { font-size: 2.4rem; font-weight: 600; margin: 0 0 0.15rem; line-height: 1.15; }
.lede { font-size: 1.15rem; margin: 0 0 0.35rem; }
.cv-summary { margin: 0 0 0.45rem; color: #4a4741; }
.contact-line { margin: 0; color: #4a4741; }
.contact-line a { white-space: nowrap; }
.contact-separator { color: #b4b0a8; margin: 0 0.15em; }

.columns { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 0 0.32in; }
.cv-block { margin-bottom: 0.85rem; }
.cv-block h2 {
  font-size: 1.3rem;
  font-weight: 600;
  line-height: 1.2;
  border-bottom: 0.75pt solid #d8d6d0;
  padding-bottom: 0.2rem;
  margin: 0 0 0.45rem;
  break-after: avoid;
}
.cv-entry { margin-bottom: 0.45rem; break-inside: avoid; }
.entry-head { display: flex; justify-content: space-between; gap: 0.6rem; align-items: baseline; }
.entry-title { font-weight: 600; }
.cv-when { color: #6b675f; font-size: 0.92rem; white-space: nowrap; flex-shrink: 0; }
.cv-where { color: #6b675f; }
.cv-entry p, .cv-entry ul { margin: 0.1rem 0 0; }
.cv-entry ul { padding-left: 1.05em; }
.cv-entry li { margin-bottom: 0.06rem; }
.skill-list { list-style: none; padding: 0; margin: 0; }
.skill-list li { margin-bottom: 0.25rem; }
/* Category and items on one line: "Languages: JavaScript, ..." */
.skill-list strong::after { content: ": "; }
:lang(zh) .skill-list strong::after { content: "："; }
"""


def read_portrait_data_uri(portrait_path):
    portrait_image = Image.open(portrait_path).convert("RGB")
    cropped_image = portrait_image.crop(PORTRAIT_CROP_BOX)
    output_height_pixels = round(
        cropped_image.height * PORTRAIT_OUTPUT_WIDTH_PIXELS / cropped_image.width
    )
    resized_image = cropped_image.resize(
        (PORTRAIT_OUTPUT_WIDTH_PIXELS, output_height_pixels), Image.LANCZOS
    )
    jpeg_buffer = io.BytesIO()
    resized_image.save(jpeg_buffer, format="JPEG", quality=88)
    encoded_bytes = base64.b64encode(jpeg_buffer.getvalue()).decode("ascii")
    return "data:image/jpeg;base64," + encoded_bytes


def extract_first(pattern, source_html, description):
    match = re.search(pattern, source_html, re.DOTALL)
    if match is None:
        raise ValueError("Could not find " + description + " in the CV page.")
    return match.group(1).strip()


def make_links_absolute(fragment_html):
    """Relative site links would be dead inside a PDF; point them at the live site."""
    return re.sub(
        r'href="(?!https?:|mailto:|#)([^"]+)"',
        lambda match: 'href="' + SITE_URL + match.group(1) + '"',
        fragment_html,
    )


def plain_text(fragment_html):
    return html.unescape(re.sub(r"<[^>]+>", "", fragment_html)).strip()


def build_contact_line(hero_actions_html, aside_html):
    """One line of short labelled links: the email address, then the hero
    buttons and the sidebar link lists by their labels, each target once."""
    labelled_links = []
    for href, label_html in re.findall(
        r'<a[^>]*href="([^"]+)"[^>]*>(.*?)</a>', hero_actions_html, re.DOTALL
    ):
        labelled_links.append((href, plain_text(label_html)))
    for label_html, href in re.findall(
        r'<li><strong>([^<]*)</strong>\s*<a[^>]*href="([^"]+)"', aside_html
    ):
        labelled_links.append((href, plain_text(label_html)))

    contact_links = []
    seen_hrefs = set()
    for href, label_text in labelled_links:
        is_language_switch = href.endswith(".html") and not href.startswith("http")
        if is_language_switch or href in seen_hrefs:
            continue
        seen_hrefs.add(href)
        if href.startswith("mailto:"):
            label_text = href[len("mailto:"):]
        contact_links.append('<a href="' + href + '">' + html.escape(label_text) + "</a>")
    separator_html = ' <span class="contact-separator">·</span> '
    return '<p class="contact-line">' + separator_html.join(contact_links) + "</p>"


def restructure_entry(entry_match):
    """Put the entry title and its date on one line: <title ...... date>."""
    when_html = entry_match.group(1).strip()
    body_html = entry_match.group(2).strip()
    title_match = re.match(r"<p>(.*?)</p>(.*)", body_html, re.DOTALL)
    if title_match is not None:
        title_html = title_match.group(1)
        remaining_body_html = title_match.group(2)
    else:
        # Entries such as "Exhibitions" use the date column as their label.
        title_html = when_html
        when_html = ""
        remaining_body_html = body_html
    return (
        '<div class="cv-entry"><div class="entry-head">'
        '<span class="entry-title">' + title_html + "</span>"
        '<span class="cv-when">' + when_html + "</span></div>"
        + remaining_body_html
        + "</div>"
    )


def restructure_entries(sections_html):
    return re.sub(
        r'<div class="cv-entry">\s*<div class="cv-when">(.*?)</div>\s*<div>(.*?)</div>\s*</div>(?=\s*(?:<div class="cv-entry">|</section>))',
        restructure_entry,
        sections_html,
        flags=re.DOTALL,
    )


def build_print_html(source_html, variant, portrait_data_uri):
    language_code = extract_first(r'<html lang="([^"]+)"', source_html, "html lang")
    page_title = extract_first(r"<title>(.*?)</title>", source_html, "title")
    full_name_html = extract_first(r"<h1>(.*?)</h1>", source_html, "name")
    lede_html = extract_first(r'<p class="lede">(.*?)</p>', source_html, "lede")
    summary_html = extract_first(r'<p class="cv-summary">(.*?)</p>', source_html, "summary")
    hero_actions_html = extract_first(
        r'<div class="hero-actions">(.*?)</div>', source_html, "contact buttons"
    )
    main_column_html = extract_first(
        r'<div class="cv-layout">\s*<div>(.*?)</div>\s*<aside>', source_html, "main column"
    )
    aside_html = extract_first(r"<aside>(.*?)</aside>", source_html, "sidebar")

    contact_line_html = build_contact_line(hero_actions_html, aside_html)

    # The sidebar's link lists ("Online") are already in the header's contact
    # line; keep only the sidebar sections that are not pure link lists.
    aside_sections = re.findall(r'<section class="cv-block">.*?</section>', aside_html, re.DOTALL)
    aside_sections_without_link_lists = [
        section_html for section_html in aside_sections
        if len(re.findall(r"<li>", section_html)) != len(re.findall(r"<li>.*?<a ", section_html))
    ]

    body_sections_html = restructure_entries(main_column_html) + "\n".join(
        aside_sections_without_link_lists
    )

    stylesheet = (
        PRINT_STYLESHEET.replace("__PAPER_FORMAT__", variant["paper_format"])
        .replace("__PAPER_WIDTH__", str(variant["paper_width_inches"]))
        .replace("__MARGIN__", str(PAGE_MARGIN_INCHES))
    )

    document_html = (
        '<!DOCTYPE html><html lang="' + language_code + '"><head><meta charset="UTF-8" />'
        "<title>" + page_title + "</title>"
        '<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600'
        '&family=Noto+Sans+SC:wght@400;600&display=block" rel="stylesheet" />'
        "<style>" + stylesheet + "</style></head><body>"
        '<div class="sheet">'
        '<div class="header">'
        '<img class="portrait" src="' + portrait_data_uri + '" alt="" />'
        "<div>"
        "<h1>" + full_name_html + "</h1>"
        '<p class="lede">' + lede_html + "</p>"
        '<p class="cv-summary">' + summary_html + "</p>"
        + contact_line_html
        + "</div></div>"
        '<div class="columns"><div class="column" id="left-column">' + body_sections_html
        + '</div><div class="column" id="right-column"></div></div>'
        "</div></body></html>"
    )
    return make_links_absolute(document_html)


def content_fits_on_one_page(browser_page, variant):
    page_height_pixels = variant["paper_height_inches"] * CSS_PIXELS_PER_INCH
    content_height_pixels = browser_page.evaluate(
        "document.querySelector('.sheet').scrollHeight"
    )
    return content_height_pixels <= page_height_pixels - 2


def fit_font_size(browser_page, variant):
    """Binary search for the largest base type size that keeps one page.
    Returns None if even the smallest size overflows."""

    def fits_at(font_size_points):
        browser_page.evaluate(
            "function (sizeInPoints) { document.documentElement.style.fontSize = sizeInPoints + 'pt'; }",
            font_size_points,
        )
        return content_fits_on_one_page(browser_page, variant)

    smallest_points = SMALLEST_FONT_SIZE_POINTS
    largest_points = LARGEST_FONT_SIZE_POINTS
    if not fits_at(smallest_points):
        return None
    for _ in range(10):
        middle_points = (smallest_points + largest_points) / 2
        if fits_at(middle_points):
            smallest_points = middle_points
        else:
            largest_points = middle_points
    chosen_font_size_points = int(smallest_points * 20) / 20  # round down to 0.05 pt
    fits_at(chosen_font_size_points)
    return chosen_font_size_points


ARRANGE_COLUMNS_SCRIPT = """
function (leftColumnSectionCount) {
  var leftColumn = document.getElementById('left-column');
  var rightColumn = document.getElementById('right-column');
  var sections = Array.prototype.slice.call(document.querySelectorAll('.cv-block'));
  // Number the sections on first sight (document order is reading order
  // then); later calls restore that order after sections have been moved.
  sections.forEach(function (section, documentIndex) {
    if (!section.hasAttribute('data-reading-order')) {
      section.setAttribute('data-reading-order', documentIndex);
    }
  });
  sections.sort(function (firstSection, secondSection) {
    return Number(firstSection.getAttribute('data-reading-order'))
      - Number(secondSection.getAttribute('data-reading-order'));
  });
  sections.forEach(function (section, readingIndex) {
    (readingIndex < leftColumnSectionCount ? leftColumn : rightColumn).appendChild(section);
  });
  return sections.length;
}
"""


def render_variant(browser_page, variant, portrait_data_uri):
    source_html = (SITE_ROOT / variant["source_file"]).read_text(encoding="utf-8")
    # Lay out at exactly the paper size so measurement matches the printout.
    browser_page.set_viewport_size({
        "width": round(variant["paper_width_inches"] * CSS_PIXELS_PER_INCH),
        "height": round(variant["paper_height_inches"] * CSS_PIXELS_PER_INCH),
    })
    browser_page.set_content(
        build_print_html(source_html, variant, portrait_data_uri), wait_until="networkidle"
    )
    browser_page.evaluate("document.fonts.ready.then(function () { return true; })")

    # Whole sections per column, so each column starts with a heading. Try
    # every split point (in reading order) and keep the one allowing the
    # largest type.
    section_count = browser_page.evaluate(ARRANGE_COLUMNS_SCRIPT, 0)
    font_size_points = None
    best_left_column_section_count = None
    for left_column_section_count in range(1, section_count):
        browser_page.evaluate(ARRANGE_COLUMNS_SCRIPT, left_column_section_count)
        candidate_font_size_points = fit_font_size(browser_page, variant)
        if candidate_font_size_points is not None and (
            font_size_points is None or candidate_font_size_points > font_size_points
        ):
            font_size_points = candidate_font_size_points
            best_left_column_section_count = left_column_section_count
    if font_size_points is None:
        raise RuntimeError(variant["source_file"] + " does not fit on one page even at "
                           + str(SMALLEST_FONT_SIZE_POINTS) + " pt.")
    browser_page.evaluate(ARRANGE_COLUMNS_SCRIPT, best_left_column_section_count)
    browser_page.evaluate(
        "function (sizeInPoints) { document.documentElement.style.fontSize = sizeInPoints + 'pt'; }",
        font_size_points,
    )

    output_path = SITE_ROOT / variant["output_file"]
    browser_page.pdf(
        path=str(output_path),
        format=variant["paper_format"],
        print_background=True,
        prefer_css_page_size=True,
        margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
    )
    return output_path, font_size_points


def verify_pdf(output_path):
    pdf_document = fitz.open(output_path)
    page_count = pdf_document.page_count
    link_targets = [link.get("uri") for link in pdf_document[0].get_links() if link.get("uri")]
    pdf_document.close()
    return page_count, link_targets


def main():
    portrait_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_PORTRAIT_PATH
    portrait_data_uri = read_portrait_data_uri(portrait_path)
    with sync_playwright() as playwright_session:
        browser = playwright_session.chromium.launch(channel="chrome")
        browser_page = browser.new_page()
        browser_page.emulate_media(media="print")
        for variant in CV_VARIANTS:
            output_path, font_size_points = render_variant(browser_page, variant, portrait_data_uri)
            page_count, link_targets = verify_pdf(output_path)
            print(output_path.name + ": " + str(page_count) + " page(s), base type "
                  + str(font_size_points) + " pt, " + str(len(link_targets)) + " links")
            for link_target in link_targets:
                print("    " + link_target)
        browser.close()


if __name__ == "__main__":
    main()
