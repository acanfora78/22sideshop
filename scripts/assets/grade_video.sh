#!/usr/bin/env bash
# Grade + compress an AI-generated clip for the web.
#   grade_video.sh SRC.mp4 OUT_BASENAME   →  OUT.mp4 (1280w), OUT-m.mp4 (720w), OUT.webp (poster)
# Muted, desaturated grade close to scripts/assets/grade.py; audio stripped; faststart for streaming.
set -euo pipefail
src="$1"; out="$2"
vf="eq=saturation=0.42:contrast=1.08:brightness=-0.01"
ffmpeg -loglevel error -y -i "$src" -an -vf "$vf,scale=1280:-2:flags=lanczos" -c:v libx264 -preset slow -crf 25 -pix_fmt yuv420p -movflags +faststart "$out.mp4"
ffmpeg -loglevel error -y -i "$src" -an -vf "$vf,scale=720:-2:flags=lanczos" -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart "$out-m.mp4"
ffmpeg -loglevel error -y -i "$out.mp4" -frames:v 1 -q:v 80 "$out.webp"
ls -la "$out.mp4" "$out-m.mp4" "$out.webp"
