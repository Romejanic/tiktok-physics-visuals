#!/bin/bash

# exit on error
set -e

# clear old render and draw the sim frames
rm -rf out
npm start

# use ffmpeg to convert frames to an mp4 file
cd out
ffmpeg -framerate 30 -pattern_type glob -i '*.png' -c:v libx264 -pix_fmt yuv420p out.mp4
