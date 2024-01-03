#!/bin/bash

# exit on error
set -e

# require sim name
if [[ $# -lt 1 ]]; then
    echo "Usage: ./render.sh [sim-name]"
    exit 1
fi
SIM_NAME="${1}"

# clear old render and draw the sim frames
rm -rf out
npm start $SIM_NAME

# get fps value from config
FPS=$(jq -r '.render.framesPerSecond' src/config.json)

# use ffmpeg to convert frames to an mp4 file
cd out
ffmpeg -framerate $FPS -pattern_type glob -i '*.png' -c:v libx264 -pix_fmt yuv420p out.mp4

# merge audio and video tracks
if [[ -f audio.wav ]]; then
    ffmpeg -i out.mp4 -i audio.wav -c copy -shortest final.mp4
else
    echo "Audio track not found! Check the error logs"
fi
