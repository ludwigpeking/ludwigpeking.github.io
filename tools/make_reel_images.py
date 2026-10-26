"""Make the smaller stills used by the rolling rows on the home page.

Stills are made for the card thumbnails named in data/projects.js (the
`thumb:` fields), so rerun this after editing that list. The project cards
elsewhere use the full-size stills (1200 x 675, 16:9 like a screen). A reel
card is at most about 500 CSS pixels wide, so the reels load a smaller copy
that is still sharp on a high-density screen:

  img/projects/<name>.jpg -> img/projects/reel/<name>.jpg   800 x 450 JPEG

The motion previews (img/projects/motion/<name>.mp4, 800 x 450 silent H.264)
are small enough to be played by the reels directly, so no copies are made.

Only copies that are missing or older than their source are rebuilt.
Run from the repository root after adding or changing a project image:

  python tools/make_reel_images.py

Needs Pillow (pip install pillow).
"""
import pathlib
import re

from PIL import Image

REEL_STILL_SIZE_PIXELS = (800, 450)
REEL_STILL_JPEG_QUALITY = 80

repository_root = pathlib.Path(__file__).resolve().parent.parent
projects_image_directory = repository_root / "img" / "projects"


def is_up_to_date(source_path, output_path):
    return output_path.exists() and output_path.stat().st_mtime >= source_path.stat().st_mtime


def cover_resize(image, target_size_pixels):
    """Scale the image to fill the target size and crop the overflow evenly."""
    target_width, target_height = target_size_pixels
    scale_factor = max(target_width / image.width, target_height / image.height)
    scaled_width = round(image.width * scale_factor)
    scaled_height = round(image.height * scale_factor)
    scaled_image = image.resize((scaled_width, scaled_height), Image.LANCZOS)
    left_offset = (scaled_width - target_width) // 2
    top_offset = (scaled_height - target_height) // 2
    return scaled_image.crop((left_offset, top_offset, left_offset + target_width, top_offset + target_height))


def thumbnail_paths_in_catalogue():
    """The card thumbnails named in data/projects.js (the `thumb:` fields)."""
    catalogue_text = (repository_root / "data" / "projects.js").read_text(encoding="utf-8")
    thumbnail_names = re.findall(r'\bthumb:\s*"img/projects/([^"/]+\.jpg)"', catalogue_text)
    return [projects_image_directory / thumbnail_name for thumbnail_name in sorted(set(thumbnail_names))]


def make_reel_stills():
    output_directory = projects_image_directory / "reel"
    output_directory.mkdir(exist_ok=True)
    for source_path in thumbnail_paths_in_catalogue():
        if not source_path.exists():
            print(f"still  {source_path.name:40} missing, skipped")
            continue
        output_path = output_directory / source_path.name
        if is_up_to_date(source_path, output_path):
            continue
        with Image.open(source_path) as source_image:
            reel_image = cover_resize(source_image.convert("RGB"), REEL_STILL_SIZE_PIXELS)
        reel_image.save(output_path, quality=REEL_STILL_JPEG_QUALITY, optimize=True, progressive=True)
        print(f"still  {source_path.name:40} {source_path.stat().st_size // 1024:5} kB -> {output_path.stat().st_size // 1024:4} kB")


if __name__ == "__main__":
    make_reel_stills()
