#!/bin/bash
set -e

rm -rf out
npm start

cd out
ffmpeg -framerate 30 -pattern_type glob -i '*.png'   -c:v libx264 -pix_fmt yuv420p out.mp4
