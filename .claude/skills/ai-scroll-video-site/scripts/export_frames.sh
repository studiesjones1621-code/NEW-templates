#!/usr/bin/env bash
# Cut a generated scene clip into a numbered WebP sequence for <ScrubScene>.
# Usage: export_frames.sh clip.mp4 public/seq/<name> [frames=100] [width=800] [quality=62]
# 100 frames at 800x450, quality 62 ≈ 1.2–3.7 MB per scene (busier footage is bigger).
set -euo pipefail
src="$1"; out="$2"; n="${3:-100}"; w="${4:-800}"; q="${5:-62}"
mkdir -p "$out"; rm -f "$out"/*.webp
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$src")
h=$(( w * 9 / 16 ))
ffmpeg -v error -i "$src" -vf "fps=${n}/${dur},scale=${w}:${h}" -frames:v "$n" -c:v libwebp -quality "$q" -compression_level 6 "$out/%03d.webp"
echo "$(ls "$out" | wc -l) frames, $(du -sh "$out" | cut -f1) in $out"
