import { CanvasRenderingContext2D } from "canvas";

export default abstract class Simulation {

    private readonly screenWidth: number;
    private readonly screenHeight: number;

    constructor(screenWidth: number, screenHeight: number) {
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
    }

    /**
     * Called when the sim first starts. Used to set up the scene
     * and also to clear any pre-existing elements.
     */
    abstract init(): void;

    /**
     * Runs another step of the simulation.
     * @param delta The number of seconds passed since the last step
     */
    abstract simulate(delta: number): void;

    /**
     * Draws the current state of the simulation to the screen.
     * @param ctx The canvas context to draw onto.
     */
    abstract draw(ctx: CanvasRenderingContext2D): void;

    /**
     * The width of the current screen.
     */
    get width() {
        return this.screenWidth;
    }

    /**
     * The height of the current screen.
     */
    get height() {
        return this.screenHeight;
    }

}
