import { Canvas, PNGStream, createCanvas } from "canvas";
import { createWriteStream, mkdirSync } from "fs";
import Graphics from "./drawing";
import simulations from "./sim-list";
import config from "./config.json";

async function main() {
    // get the name of the simulation to render
    if(process.argv.length < 3) return error("Usage: ./render.sh [sim-name]");
    const simName = process.argv[2];

    // read config values
    const screenWidth = config.render.screenWidth;
    const screenHeight = config.render.screenHeight;
    const simWidth = config.preview.screenWidth;
    const simHeight = config.preview.screenHeight;
    const fps = config.render.framesPerSecond;
    const bgColor = config.render.background;

    // create canvas to draw frames
    const canvas = createCanvas(screenWidth, screenHeight);
    const scaleFactor = screenHeight / simHeight;
    const graphics = new Graphics(canvas, scaleFactor);

    // get simulation instance by name
    const SimClass = simulations[simName];
    if(!SimClass) return error(`Unknown sim name: ${simName}`);
    const sim = new SimClass(simWidth, simHeight);
    sim.init();

    // create frame output directory
    mkdirSync("out");

    // draw each from
    const frameCount = Math.round(sim.duration * fps);
    const timeStep = 1 / fps;
    for(let i = 0; i < frameCount; i++) {
        sim.simulate(timeStep);

        // draw simulation
        graphics.clear(bgColor);
        sim.draw(graphics);

        // save frame to disk
        await saveFrame(canvas, i);
        console.log(`Frame ${i}/${frameCount} done`);
    }
}

async function saveFrame(canvas: Canvas, frameIndex: number) {
    const data = canvas.createPNGStream();
    await saveStreamToFile(data, `out/sim-frame-${String(frameIndex).padStart(4, "0")}.png`);
}

function saveStreamToFile(stream: PNGStream, path: string) {
    return new Promise((resolve, reject) => {
        const out = createWriteStream(path);
        out.on("error", reject);
        out.on("finish", resolve);
        stream.on("error", reject);
        stream.pipe(out);
    });
}

function error(msg: string) {
    console.error(msg);
    process.exit(1);
}

// config types
// interface ScreenConfig {
//     screenWidth: number;
//     screenHeight: number;
//     framesPerSecond?: number;
// }

// interface AppConfig {
//     render: ScreenConfig;
//     preview: ScreenConfig;
// }

// start script
main();
