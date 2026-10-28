"""Local editor for the project titles and card summaries.

Run from the repository root:

  python tools/copy_editor.py

then open http://127.0.0.1:8779/ in a browser. The page lists every project
as a card, with its thumbnail, a field for the title and a field for the
summary shown under the thumbnail on the work page. Save writes the changed
`title:` and `summary:` lines into data/projects.js in place, leaving
everything else in the file as it is.
"""
import json
import mimetypes
import pathlib
import re
import subprocess
import sys
from http.server import BaseHTTPRequestHandler, HTTPServer

repository_root = pathlib.Path(__file__).resolve().parent.parent
catalogue_path = repository_root / "data" / "projects.js"
page_path = repository_root / "tools" / "copy_editor.html"
port = 8779
editable_fields = ("title", "summary")


def read_catalogue():
    """Projects and categories as plain data, by evaluating the catalogue with Node."""
    script = (
        "global.window = {}; require(%s);"
        "console.log(JSON.stringify({ categories: window.CATEGORIES.map(function (category) {"
        "return { id: category.id, label: category.label }; }),"
        "projects: window.PROJECTS.map(function (project) {"
        "return { id: project.id, title: project.title, category: project.category, year: project.year,"
        " context: project.context, summary: project.summary, thumb: project.thumb }; }) }));"
    ) % json.dumps(str(catalogue_path))
    output = subprocess.run(["node", "-e", script], capture_output=True, text=True, check=True, encoding="utf-8")
    return json.loads(output.stdout)


def project_block_span(text, project_id):
    """Start and end offsets of the project's entry inside the catalogue text."""
    id_match = re.search(r'\n\s*id:\s*"' + re.escape(project_id) + r'",', text)
    if not id_match:
        raise ValueError("project not found: " + project_id)
    next_id = re.search(r'\n\s*id:\s*"', text[id_match.end():])
    block_end = id_match.end() + next_id.start() if next_id else len(text)
    return id_match.end(), block_end


def replace_string_field(block, field_name, value):
    """Rewrite `field: "..."` (on one line or with the string on the next line)
    inside a project block, keeping the layout it already has."""
    field_pattern = re.compile(r'(\n(\s*)' + field_name + r':\s*\n?\s*)"((?:[^"\\]|\\.)*)"')
    match = field_pattern.search(block)
    literal = json.dumps(value, ensure_ascii=False)
    if match:
        return block[:match.start()] + match.group(1) + literal + block[match.end():]
    # A project without the field gets it right after its title line (or at the top).
    title_match = re.search(r'\n(\s*)title:.*', block)
    insert_at = title_match.end() if title_match else 0
    indent = title_match.group(1) if title_match else "    "
    return block[:insert_at] + "\n" + indent + field_name + ":\n" + indent + "  " + literal + "," + block[insert_at:]


def write_fields(fields_by_id):
    """Replace the given projects' title and summary strings in data/projects.js."""
    text = catalogue_path.read_text(encoding="utf-8")
    changed_count = 0
    for project_id, fields in fields_by_id.items():
        start, end = project_block_span(text, project_id)
        block = text[start:end]
        new_block = block
        for field_name in editable_fields:
            if field_name in fields:
                new_block = replace_string_field(new_block, field_name, fields[field_name].strip())
        if new_block != block:
            changed_count += 1
        text = text[:start] + new_block + text[end:]
    catalogue_path.write_text(text, encoding="utf-8", newline="\n")
    # Make sure the result still parses before reporting success.
    read_catalogue()
    return changed_count


class CopyEditorHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path in ("/", "/index.html"):
            self.respond(200, page_path.read_bytes(), "text/html; charset=utf-8")
        elif self.path == "/catalogue":
            self.respond(200, json.dumps(read_catalogue(), ensure_ascii=False).encode("utf-8"), "application/json; charset=utf-8")
        elif self.path.startswith("/img/"):
            self.serve_image()
        else:
            self.respond(404, b"not found", "text/plain")

    def serve_image(self):
        """Thumbnails straight from the repository's img folder."""
        relative = pathlib.PurePosixPath(self.path.split("?")[0].lstrip("/"))
        image_root = (repository_root / "img").resolve()
        image_path = (repository_root / pathlib.Path(*relative.parts)).resolve()
        if image_root not in image_path.parents or not image_path.is_file():
            self.respond(404, b"not found", "text/plain")
            return
        content_type = mimetypes.guess_type(str(image_path))[0] or "application/octet-stream"
        self.respond(200, image_path.read_bytes(), content_type)

    def do_POST(self):
        if self.path != "/save":
            self.respond(404, b"not found", "text/plain")
            return
        length = int(self.headers.get("Content-Length", "0"))
        payload = json.loads(self.rfile.read(length).decode("utf-8"))
        try:
            changed_count = write_fields(payload["fieldsById"])
            self.respond(200, json.dumps({"ok": True, "changedProjects": changed_count}).encode("utf-8"), "application/json")
        except Exception as error:
            self.respond(500, json.dumps({"ok": False, "error": str(error)}).encode("utf-8"), "application/json")

    def respond(self, status, body, content_type):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format, *arguments):
        sys.stdout.write("%s - %s\n" % (self.address_string(), format % arguments))


if __name__ == "__main__":
    print("Copy editor on http://127.0.0.1:%d/  (editing %s)" % (port, catalogue_path))
    HTTPServer(("127.0.0.1", port), CopyEditorHandler).serve_forever()
