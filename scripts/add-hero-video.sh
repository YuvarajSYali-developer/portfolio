#!/usr/bin/env bash
# Usage: bash scripts/add-hero-video.sh path/to/your-video.mp4
# Trims to 15 s, strips audio, compresses for the web, and regenerates the poster + hero background.
set -euo pipefail
IN="${1:?Pass the path to a video file}"
ffmpeg -y -i "$IN" -t 15 -an -vf "scale=-2:'min(1080,ih)',fps=30" \
  -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart public/videos/hero-reel.mp4
ffmpeg -y -i public/videos/hero-reel.mp4 -frames:v 1 -c:v libwebp -quality 72 public/videos/hero-poster.webp
ffmpeg -y -ss 1 -i public/videos/hero-reel.mp4 -frames:v 1 \
  -vf "scale=1920:-2,gblur=sigma=40,eq=brightness=-0.05" -c:v libwebp -quality 60 public/images/hero-bg.webp
echo "Hero video updated: $(du -h public/videos/hero-reel.mp4 | cut -f1)"
