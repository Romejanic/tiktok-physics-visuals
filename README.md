# tiktok-physics-visuals
A collection of physics visualisations for my TikTok page

## Getting started
**Install dependencies**
```sh
git clone https://github.com/Romejanic/tiktok-physics-visuals.git
cd tiktok-physics-visuals
npm i
```

**Mac Users:** you will need to install some extra dependencies before running `npm i`.
```sh
brew install pkg-config cairo pango libpng jpeg giflib librsvg 
```

**Open dev preview of simulation**
```sh
npm run dev
```

This will open up http://localhost:5713 on your browser, allowing you to test, debug and hot-reload the changes you make to the simulation without needing to render to a file.

**Render animation to file**
```sh
sudo apt update
sudo apt install ffmpeg
./render.sh
```
The generated frames will be located in `out/` and the full animation will be in the `out/out.mp4` file.

## Configuration
The configuration for the animation is located in the `src/config.json` file. For example
```json
{
    "render": {
        "screenWidth": 1080,
        "screenHeight": 1920,
        "framesPerSecond": 30,
        "duration": 10.0,
        "background": "#d9e7ff"
    },
    "preview": {
        "screenWidth": 450,
        "screenHeight": 800,
        "background": "#d9e7ff"
    }
}
```

Here you can alter the output resolution, FPS, length of the animation, etc.
