import Graphics from "./drawing";
import AudioTrack from "./sound";

export default abstract class Simulation {

    private readonly screenWidth: number;
    private readonly screenHeight: number;

    constructor(screenWidth: number, screenHeight: number) {
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
    }

    /**
     * Length of the animation in seconds.
     */
    abstract get duration(): number;

    /**
     * Called when the sim first starts. Used to set up the scene
     * and also to clear any pre-existing elements.
     */
    abstract init(): void;

    /**
     * Runs another step of the simulation.
     * @param delta The number of seconds passed since the last step
     * @param audio The audio track to play sounds to
     */
    abstract simulate(delta: number, audio: AudioTrack): void;

    /**
     * Draws the current state of the simulation to the screen.
     * @param g The graphics object used to draw graphics.
     */
    abstract draw(g: Graphics): void;

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
