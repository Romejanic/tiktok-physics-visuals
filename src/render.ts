import { Canvas, PNGStream, createCanvas } from "canvas";
import { createWriteStream, mkdirSync } from "fs";
import Graphics from "./drawing";
import config from "./config.json";
import BouncingBall from "./simulations/bouncing_ball";

async function main() {
    const width = config.render.screenWidth;
    const height = config.render.screenHeight;
    const fps = config.render.framesPerSecond;
    const duration = config.render.duration;
    const bgColor = config.render.background;

    // create canvas to draw frames
    const canvas = createCanvas(width, height);
    const graphics = new Graphics(canvas);

    // TODO: load this from file with command
    // e.g. npm start bouncing_ball
    const sim = new BouncingBall(width, height);
    sim.init();

    // create frame output directory
    mkdirSync("out");

    // draw each from
    const frameCount = Math.round(duration * fps);
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
