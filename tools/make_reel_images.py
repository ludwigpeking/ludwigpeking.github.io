"""Make the small images used by the rolling rows on the home page.

Stills are made for the card thumbnails named in data/projects.js (the
`thumb:` fields), so rerun this after editing that list. The project cards
elsewhere use full-size images (stills 1200 x 900, animated
previews 600 x 450). A reel card is at most about 370 x 280 CSS pixels, so the
reels load small copies instead:

  img/projects/<name>.jpg          -> img/projects/reel/<name>.jpg         400 x 300 JPEG
  img/projects/motion/<name>.webp  -> img/projects/motion/reel/<name>.mp4  320 x 240 silent H.264 video

The motion copies are videos rather than animated WebP because H.264 is
about seven times smaller for the same picture (Rome WFC: 529 kB as a small
WebP, about 100 kB as video).

Only copies that are missing or older than their source are rebuilt.
Run from the repository root after adding or changing a project image:

  python tools/make_reel_images.py

Needs Pillow (pip install pillow) and ffmpeg on the PATH.
"""
import pathlib
import re
import shutil
import struct
import subprocess
import sys
import tempfile

from PIL import Image

REEL_STILL_SIZE_PIXELS = (400, 300)
REEL_STILL_JPEG_QUALITY = 80
REEL_MOTION_SIZE_PIXELS = (320, 240)
# H.264 constant rate factor: lower is better quality and bigger files.
REEL_MOTION_VIDEO_QUALITY_FACTOR = 28

repository_root = pathlib.Path(__file__).resolve().parent.parent
projects_image_directory = repository_root / "img" / "projects"
motion_image_directory = projects_image_directory / "motion"


def is_up_to_date(source_path, output_path):
    return output_path.exists() and output_path.stat().st_mtime >= source_path.stat().st_mtime


def frame_durations_milliseconds(webp_bytes):
    """Pillow does not report per-frame timing for WebP, so read the ANMF chunks."""
    durations = []
    position = 12
    while position + 8 <= len(webp_bytes):
        chunk_name = webp_bytes[position:position + 4]
        chunk_size = struct.unpack("<I", webp_bytes[position + 4:position + 8])[0]
        if chunk_name == b"ANMF":
            frame_header = webp_bytes[position + 8:position + 8 + 16]
            durations.append(int.from_bytes(frame_header[12:15], "little"))
        position += 8 + chunk_size + (chunk_size & 1)
    return durations


def cover_resize(image, target_size_pixels):
    """Scale to fill the target box and crop the overflow, keeping the centre."""
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


def make_reel_motion():
    ffmpeg_path = shutil.which("ffmpeg")
    if ffmpeg_path is None:
        sys.exit("ffmpeg is not on the PATH; it is needed for the motion previews")
    output_directory = motion_image_directory / "reel"
    output_directory.mkdir(exist_ok=True)
    # A motion preview may also be a silent 600 x 450 H.264 video (img/projects/motion/<name>.mp4),
    # used for long or detailed clips that an animated WebP cannot keep small. Those are
    # simply scaled down for the reel.
    for source_path in sorted(motion_image_directory.glob("*.mp4")):
        output_path = output_directory / source_path.name
        if is_up_to_date(source_path, output_path):
            continue
        subprocess.run(
            [
                ffmpeg_path, "-v", "error", "-y", "-i", str(source_path),
                "-vf", f"scale={REEL_MOTION_SIZE_PIXELS[0]}:{REEL_MOTION_SIZE_PIXELS[1]}:force_original_aspect_ratio=increase,crop={REEL_MOTION_SIZE_PIXELS[0]}:{REEL_MOTION_SIZE_PIXELS[1]},fps=12",
                "-c:v", "libx264", "-preset", "slow", "-crf", str(REEL_MOTION_VIDEO_QUALITY_FACTOR),
                "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an",
                str(output_path),
            ],
            check=True,
        )
        print(f"motion {source_path.name:40} {source_path.stat().st_size // 1024:5} kB -> {output_path.stat().st_size // 1024:4} kB")
    for source_path in sorted(motion_image_directory.glob("*.webp")):
        output_path = output_directory / (source_path.stem + ".mp4")
        if is_up_to_date(source_path, output_path):
            continue
        durations = frame_durations_milliseconds(source_path.read_bytes())
        with tempfile.TemporaryDirectory() as frame_directory, Image.open(source_path) as animated_image:
            if len(durations) != animated_image.n_frames:
                sys.exit(f"{source_path.name}: found {len(durations)} frame timings for {animated_image.n_frames} frames")
            # Frames can hold for different times; ffconcat keeps each frame's own duration.
            concat_lines = ["ffconcat version 1.0"]
            for frame_index in range(animated_image.n_frames):
                animated_image.seek(frame_index)
                frame_path = pathlib.Path(frame_directory) / f"frame{frame_index:04d}.png"
                cover_resize(animated_image.convert("RGB"), REEL_MOTION_SIZE_PIXELS).save(frame_path)
                concat_lines.append(f"file '{frame_path.name}'")
                concat_lines.append(f"duration {durations[frame_index] / 1000:.3f}")
            # The concat demuxer ignores the last duration unless the last file is listed again.
            concat_lines.append(f"file 'frame{animated_image.n_frames - 1:04d}.png'")
            concat_list_path = pathlib.Path(frame_directory) / "frames.ffconcat"
            concat_list_path.write_text("\n".join(concat_lines) + "\n", encoding="utf-8")
            subprocess.run(
                [
                    ffmpeg_path, "-v", "error", "-y",
                    "-f", "concat", "-safe", "0", "-i", str(concat_list_path),
                    "-vf", "fps=12",
                    "-c:v", "libx264", "-preset", "slow",
                    "-crf", str(REEL_MOTION_VIDEO_QUALITY_FACTOR),
                    "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an",
                    str(output_path),
                ],
                check=True,
            )
        print(f"motion {source_path.name:40} {source_path.stat().st_size // 1024:5} kB -> {output_path.stat().st_size // 1024:4} kB")


if __name__ == "__main__":
    make_reel_stills()
    make_reel_motion()
