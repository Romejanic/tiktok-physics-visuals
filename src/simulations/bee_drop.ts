import Graphics from "../drawing";
import { TWO_PI, randomColor, vec2, vec2_add, vec2_scale } from "../math";
import Simulation from "../sim";

const SPAWN_INTERVAL = 5;
const GAP_SIZE = 0.3;

interface Ball {
    position: vec2;
    velocity: vec2;
    size: number;
    color: string;
}

export default class BeeDroppingBalls extends Simulation {

    balls = new Array<Ball>();
    spawnTimer = 0;

    get duration(): number {
        return 30;
    }

    init(): void {
        this.spawnTimer = 0;
        this.balls.splice(0);
        this.newBall();
    }

    draw(g: Graphics): void {
        // draw all balls
        for(const b of this.balls) {
            g.fillColor(b.color);
            g.circle(...b.position, b.size, true);
        }

        // draw test tube shape
        g.translate(this.width/2, this.height/2);
        g.rotate(-Math.PI / 2);
        g.strokeSize(2);
        g.strokeColor("black");
        g.arc(0, 0, this.width/3, GAP_SIZE, TWO_PI-GAP_SIZE);
        g.reset();
    }

    simulate(delta: number): void {
        this.spawnTimer += delta;

        // spawn new balls at each spawn interval
        if(this.spawnTimer >= SPAWN_INTERVAL) {
            this.spawnTimer = 0;
            this.newBall();
        }

        // simulate balls
        for(const b of this.balls) {
            const gravity = 98 * delta;
            b.velocity = vec2_add(b.velocity, [0, gravity]);
            b.position = vec2_add(b.position, vec2_scale(b.velocity, delta));
        }

    }

    newBall() {
        this.balls.push({
            position: [ this.width/2, this.height/2-this.width/3 ],
            velocity: [0, 0],
            size: 10,
            color: randomColor()
        });
    }

}
