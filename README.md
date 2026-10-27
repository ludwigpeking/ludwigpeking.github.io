# ludwigpeking.github.io

Personal portfolio of Richard Qian Li. Static site, no build step, hosted on GitHub Pages.

## Structure

- `index.html` home: hero, four category tiles, featured projects, links to sketches, writing, architecture and CV.
- `work.html` all projects, filterable by `?category=web|games|interactive|creative` or across categories by `?tag=<tag>`.
- `project.html?id=<slug>` one project, rendered from `data/projects.js`.
- `sketches.html` curated p5.js sketches from `data/sketches.js`; each opens in a full-screen viewer that embeds `editor.p5js.org/ludwig.peking/full/<id>`.
- `writing.html` book chapters and podcast.
- `cv.html` curriculum vitae.
- `architecture.html`, `archproject.html?fragment=architecture/<name>.html`, `gallery.html` the earlier architecture practice and hand drawings.
- `site.js` shared behaviour: theme toggle, header and footer, card and project rendering, lazy embeds, sketch viewer.
- `styles.css` one stylesheet, mobile-first, light and dark via `prefers-color-scheme` and a stored toggle.
- `data/projects.js` the project catalogue. Add a project here and it appears everywhere.
- `data/sketches.js` the p5 sketch list with thumbnails in `img/sketches/`.
- `img/projects/` thumbnails (1200x900), heroes (1600x900) and gallery images (max 1600 wide). No video files: films are embedded from YouTube, and projects without a film show a placeholder box.
- `coding/` and `architecture/` HTML fragments with long-form descriptions, loaded into project pages via the `fragment` field.
- `_legacy/` the pre-2026 pages, kept for reference and not linked.

## Adding a project

Append an object to `window.PROJECTS` in `data/projects.js` with `id`, `title`, `category`, `year`, `summary`, `tags`, `thumb`, and optionally `hero`, `thumbMotion` (silent H.264 video in `img/projects/motion/`, 800 x 450, six to thirty seconds, played whenever the card is in view), `youtube` (list of `{id, label}`), `videoPending` (note shown in the placeholder box), `embed`, `links`, `body` (HTML), `fragment`, `gallery`, `featured` and `copyPending` (marks placeholder text).

`PORTFOLIO_PLAN.md` holds the October 2026 reorganisation plan, the media sources for every project and the list of material still missing.

## Editing tags

Run `python tools/tag_editor.py` from the repository root and open
http://127.0.0.1:8778/. The page is a table of projects against tags: click a
cell to add or remove a tag from a project, click a tag name to rename it
(renaming onto an existing name merges the two), use the field at the top to
add a tag, and the × above a column removes that tag from every project. Save
rewrites only the `tags: [...]` lines in `data/projects.js`; commit the result
as usual.
