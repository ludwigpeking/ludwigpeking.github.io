"""Local tag editor for the project catalogue.

Run from the repository root:

  python tools/tag_editor.py

then open http://127.0.0.1:8778/ in a browser. The page shows a table of
projects against tags: tick or untick a cell to add or remove a tag from a
project, rename a tag by editing its column header, add a new tag, or delete a
tag column. Save writes the new `tags: [...]` arrays into data/projects.js in
place, leaving everything else in the file as it is.
"""
import json
import pathlib
import re
import subprocess
import sys
from http.server import BaseHTTPRequestHandler, HTTPServer

repository_root = pathlib.Path(__file__).resolve().parent.parent
catalogue_path = repository_root / "data" / "projects.js"
page_path = repository_root / "tools" / "tag_editor.html"
port = 8778


def read_catalogue():
    """Projects as plain data, by evaluating the catalogue with Node."""
    script = (
        "global.window = {}; require(%s);"
        "console.log(JSON.stringify(window.PROJECTS.map(function (project) {"
        "return { id: project.id, title: project.title, category: project.category, tags: project.tags || [] }; })));"
    ) % json.dumps(str(catalogue_path))
    output = subprocess.run(["node", "-e", script], capture_output=True, text=True, check=True, encoding="utf-8")
    return json.loads(output.stdout)


def write_tags(tags_by_id):
    """Replace each project's tags array inside data/projects.js, leaving the rest untouched."""
    text = catalogue_path.read_text(encoding="utf-8")
    changed_count = 0
    for project_id, tags in tags_by_id.items():
        id_match = re.search(r'\n\s*id:\s*"' + re.escape(project_id) + r'",', text)
        if not id_match:
            raise ValueError("project not found: " + project_id)
        block_end = re.search(r'\n\s*id:\s*"', text[id_match.end():])
        block_end_index = id_match.end() + block_end.start() if block_end else len(text)
        block = text[id_match.end():block_end_index]
        tags_match = re.search(r'(\n(\s*)tags:\s*\[)[^\]]*(\])', block)
        new_array = ", ".join(json.dumps(tag, ensure_ascii=False) for tag in tags)
        if tags_match:
            new_block = block[:tags_match.start()] + tags_match.group(1) + new_array + tags_match.group(3) + block[tags_match.end():]
        else:
            # A project without a tags line gets one right after its id.
            indent = re.match(r'\n(\s*)', text[id_match.start():]).group(1)
            new_block = "\n" + indent + "tags: [" + new_array + "]," + block
        if new_block != block:
            changed_count += 1
        text = text[:id_match.end()] + new_block + text[block_end_index:]
    catalogue_path.write_text(text, encoding="utf-8", newline="\n")
    # Make sure the result still parses before reporting success.
    read_catalogue()
    return changed_count


class TagEditorHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path in ("/", "/index.html"):
            self.respond(200, page_path.read_bytes(), "text/html; charset=utf-8")
        elif self.path == "/projects":
            self.respond(200, json.dumps(read_catalogue(), ensure_ascii=False).encode("utf-8"), "application/json; charset=utf-8")
        else:
            self.respond(404, b"not found", "text/plain")

    def do_POST(self):
        if self.path != "/save":
            self.respond(404, b"not found", "text/plain")
            return
        length = int(self.headers.get("Content-Length", "0"))
        payload = json.loads(self.rfile.read(length).decode("utf-8"))
        try:
            changed_count = write_tags(payload["tagsById"])
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
    print("Tag editor on http://127.0.0.1:%d/  (editing %s)" % (port, catalogue_path))
    HTTPServer(("127.0.0.1", port), TagEditorHandler).serve_forever()
