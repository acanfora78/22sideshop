#!/usr/bin/env bash
# Cut one AI-generated clip for the intro film.
#   cut_clip.sh SRC.mp4 START DURATION OUT_BASENAME
# → OUT.mp4 (1280w desktop), OUT-m.mp4 (720w mobile), no audio, black bars removed,
#   graded to the 22SIDE palette (muted colour, reds kept by the low saturation floor).
set -euo pipefail
src="$1"; ss="$2"; dur="$3"; out="$4"
crop=$(ffmpeg -i "$src" -t 3 -vf cropdetect=24:2:0 -f null - 2>&1 | grep -o "crop=[0-9:]*" | sort | uniq -c | sort -rn | head -1 | awk '{print $2}')
vf="${crop},eq=saturation=0.45:contrast=1.1:brightness=-0.015"
ffmpeg -loglevel error -y -ss "$ss" -t "$dur" -i "$src" -an -vf "$vf,scale=1280:-2:flags=lanczos" \
  -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -movflags +faststart "$out.mp4"
ffmpeg -loglevel error -y -ss "$ss" -t "$dur" -i "$src" -an -vf "$vf,scale=720:-2:flags=lanczos" \
  -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart "$out-m.mp4"
echo "$out ($crop) $(du -k "$out.mp4" | cut -f1)KB / $(du -k "$out-m.mp4" | cut -f1)KB"
