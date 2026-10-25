"""Local chooser for motion thumbnails.

Serves the repository over HTTP and applies a chosen candidate when the chooser
page posts to /apply:

  1. copies tools/motion-candidates/<candidate>.webp to img/projects/motion/<project id>.webp
  2. sets (or adds) the project's `thumbMotion` field in data/projects.js
  3. rebuilds the small reel copies with tools/make_reel_images.py
  4. records the choice in tools/motion_choices.json

Run from the repository root:

  python tools/choose_motion_server.py

then open http://127.0.0.1:8777/tools/choose_motion.html
"""
import http.server
import json
import pathlib
import re
import shutil
import subprocess
import sys

repository_root = pathlib.Path(__file__).resolve().parent.parent
candidate_directory = repository_root / "tools" / "motion-candidates"
motion_directory = repository_root / "img" / "projects" / "motion"
catalogue_path = repository_root / "data" / "projects.js"
choices_path = repository_root / "tools" / "motion_choices.json"
PORT = 8777


def load_choices():
    if choices_path.exists():
        return json.loads(choices_path.read_text(encoding="utf-8"))
    return {}


def set_thumb_motion(project_id, motion_path):
    """Set thumbMotion on one project object in data/projects.js, adding it after `thumb:` if absent."""
    catalogue_text = catalogue_path.read_text(encoding="utf-8")
    object_pattern = re.compile(r'(\{\s*\n\s*id:\s*"%s",)(.*?)(\n  \},?\n)' % re.escape(project_id), re.S)
    match = object_pattern.search(catalogue_text)
    if not match:
        raise ValueError("project %s not found in data/projects.js" % project_id)
    object_body = match.group(2)
    if re.search(r'\n\s*thumbMotion:\s*"[^"]*",?', object_body):
        object_body = re.sub(r'(\n\s*thumbMotion:\s*)"[^"]*"', r'\1"%s"' % motion_path, object_body, count=1)
    else:
        object_body = re.sub(r'(\n(\s*)thumb:\s*"[^"]*",)', r'\1\n\2thumbMotion: "%s",' % motion_path, object_body, count=1)
    catalogue_text = catalogue_text[: match.start(2)] + object_body + catalogue_text[match.end(2):]
    catalogue_path.write_text(catalogue_text, encoding="utf-8")


def apply_choice(project_id, candidate_name):
    source_path = candidate_directory / (candidate_name + ".webp")
    if not source_path.exists():
        raise FileNotFoundError(str(source_path))
    target_path = motion_directory / (project_id + ".webp")
    shutil.copyfile(source_path, target_path)
    set_thumb_motion(project_id, "img/projects/motion/%s.webp" % project_id)
    subprocess.run([sys.executable, str(repository_root / "tools" / "make_reel_images.py")], check=False, cwd=str(repository_root))
    choices = load_choices()
    choices[project_id] = candidate_name
    choices_path.write_text(json.dumps(choices, indent=1), encoding="utf-8")
    return choices


class ChooserHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *arguments, **keyword_arguments):
        super().__init__(*arguments, directory=str(repository_root), **keyword_arguments)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self):
        if self.path == "/choices":
            self.respond_json(load_choices())
            return
        super().do_GET()

    def do_POST(self):
        if self.path != "/apply":
            self.send_error(404)
            return
        content_length = int(self.headers.get("Content-Length", "0"))
        request = json.loads(self.rfile.read(content_length) or b"{}")
        try:
            choices = apply_choice(request["project"], request["candidate"])
            self.respond_json({"ok": True, "choices": choices})
        except Exception as error_object:
            self.respond_json({"ok": False, "error": str(error_object)}, status=500)

    def respond_json(self, payload, status=200):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format_string, *arguments):
        if "/apply" in str(arguments[0]) or "/choices" in str(arguments[0]):
            super().log_message(format_string, *arguments)


if __name__ == "__main__":
    server = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), ChooserHandler)
    print("Motion chooser: http://127.0.0.1:%d/tools/choose_motion.html" % PORT)
    server.serve_forever()
