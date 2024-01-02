import BouncingBall from "./simulations/bouncing_ball";
import config from "./config.json";

// grab UI elements
const canvas = document.getElementById("output") as HTMLCanvasElement;
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const stepBtn  = document.getElementById("stepBtn");
const timer    = document.getElementById("timer");
const fpsCount = document.getElementById("fps");

// constants
const width = config.preview.screenWidth;
const height = config.preview.screenHeight;
const bgColor = config.preview.background;

const ctx = canvas.getContext("2d");

// app state
let simTime = 0;
let playing = true;
let lastFrame = Date.now();

const sim = new BouncingBall(width, height);

function initApp() {
    // resize canvas based on config
    canvas.width = width;
    canvas.height = height;

    // initialize simulation
    sim.init();

    const handleFrame = () => {
        requestAnimationFrame(handleFrame);

        // recalculate delta time and update fps
        const delta = (Date.now() - lastFrame) / 1000;
        lastFrame = Date.now();

        // don't do anything if we're paused
        if(!playing) return;
        updateFps(delta);

        // run the simulation another step
        sim.simulate(delta);
        simTime += delta;
        updateTimer();

        drawFrame();
    };

    // start render loop
    requestAnimationFrame(handleFrame);
}

function drawFrame() {
    // draw background to clear screen
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draw simulation
    // @ts-ignore just roll with it
    sim.draw(ctx);
}

// add event handlers to UI
function updateTimer() {
    timer.innerText = `${simTime.toFixed(2)}s`;
}
function updateFps(delta: number) {
    fpsCount.innerText = `${(1/delta).toFixed(1)} fps`;
}

pauseBtn.addEventListener("click", () => {
    playing = !playing;
    pauseBtn.innerText = playing ? "Pause" : "Play";
});

resetBtn.addEventListener("click", () => {
    simTime = 0;
    updateTimer();

    // restart simulation
    sim.init();
    drawFrame();
});

stepBtn.addEventListener("click", () => {
    if(playing) return;
    const delta = 1/30; // mimic 30fps
    simTime += delta;
    sim.simulate(delta);
    updateFps(delta);
    updateTimer();
    drawFrame();
});

// start everything
initApp();
