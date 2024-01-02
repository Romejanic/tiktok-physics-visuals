import config from "./config.json";
import Graphics from "./drawing";
import simulations from "./sim-list";
import Simulation from "./sim";
import "./dev.css";

// grab UI elements
const canvas    = document.getElementById("output") as HTMLCanvasElement;
const pauseBtn  = document.getElementById("pauseBtn");
const resetBtn  = document.getElementById("resetBtn");
const stepBtn   = document.getElementById("stepBtn");
const timer     = document.getElementById("timer");
const fpsCount  = document.getElementById("fps");
const simSelect = document.getElementById("sim") as HTMLSelectElement;

// constants
const width = config.preview.screenWidth;
const height = config.preview.screenHeight;
const bgColor = config.preview.background;
const selectedKey = "selected_sim";

const graphics = new Graphics(canvas);

// app state
let simTime = 0;
let playing = true;
let lastFrame = Date.now();

let currentSimId = "";
let sim: Simulation | null = null;

function initApp() {
    // resize canvas based on config
    canvas.width = width;
    canvas.height = height;

    populateSims();

    // initialize simulation
    const SimClass = simulations[simSelect.value];
    sim = new SimClass(width, height);
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
    // draw frame
    graphics.clear(bgColor);
    sim.draw(graphics);
}

// logic for populating dropdown menu for sim
function populateSims() {
    // add an option for each simulation
    const ids = Object.keys(simulations);
    for(const id of ids) {
        const opt = document.createElement("option");
        opt.value = id;
        opt.innerText = id;
        simSelect.appendChild(opt);
    }
    
    function selectFirst() {
        (simSelect.firstChild as HTMLOptionElement).selected = true;
    }

    // if present, select the last sim set in local storage
    const lastId = localStorage.getItem(selectedKey);
    if(lastId) {
        const el = simSelect.querySelector(`[value=${lastId}]`);
        if(el) (el as HTMLOptionElement).selected = true;
        else selectFirst();
    } else {
        selectFirst();
    }
}

// add event handlers to UI
function updateTimer() {
    timer.innerText = `${simTime.toFixed(2)}s`;
}
function updateFps(delta: number) {
    fpsCount.innerText = `${(1/delta).toFixed(1)} fps`;
}

function switchSimulation(id: string) {
    if(id === currentSimId) return;
    currentSimId = id;
    const SimClass = simulations[id];
    sim = new SimClass(width, height);
    sim.init();
    simTime = 0;
    updateTimer();
    drawFrame();
    localStorage.setItem(selectedKey, currentSimId);
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

simSelect.addEventListener("change", e => {
    const id = simSelect.value;
    switchSimulation(id);
});

// start everything
initApp();
