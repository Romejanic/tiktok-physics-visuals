import Graphics from "../drawing";
import { TWO_PI } from "../math";
import Simulation from "../sim";

const SPAWN_INTERVAL = 5;
const GAP_SIZE = 0.3;

export default class BeeDroppingBalls extends Simulation {

    spawnTimer = 0;

    get duration(): number {
        return 30;
    }

    init(): void {
        this.spawnTimer = 0;
    }

    simulate(delta: number): void {
        this.spawnTimer += delta;

        if(this.spawnTimer >= SPAWN_INTERVAL) {
            this.spawnTimer = 0;
        }

    }

    draw(g: Graphics): void {

        // draw test tube shape
        g.translate(this.width/2, this.height/2);
        g.rotate(-Math.PI / 2);
        g.strokeSize(2);
        g.strokeColor("black");
        g.arc(0, 0, this.width/3, GAP_SIZE, TWO_PI-GAP_SIZE);
        g.reset();
    }

}
