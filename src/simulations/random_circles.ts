import Graphics from "../drawing";
import { vec2, vec2_add } from "../math";
import Simulation from "../sim";

interface Circle {
    position: vec2;
    size: number;
}

export default class RandomCircles extends Simulation {

    circles = new Array<Circle>();

    get duration(): number {
        return 1.0;
    }

    init(): void {
        this.circles.splice(0);
        for(let i = 0; i < 50; i++) {
            const x = Math.floor(Math.random() * this.width);
            const y = Math.floor(Math.random() * this.height);
            this.circles.push({
                position: [ x, y ],
                size: 10 + Math.random() * 40
            });
        }
    }

    draw(g: Graphics): void {
        for(const c of this.circles) {
            g.fillColor("red");
            g.strokeSize(2);
            g.strokeColor("black");
            g.circle(...c.position, c.size, true);
        }
    }

    simulate(delta: number): void {
        // jitter each circle randomly
        for(const c of this.circles) {
            const dx = Math.random() * 10 - 5;
            const dy = Math.random() * 10 - 5;
            c.position = vec2_add(c.position, [dx, dy]);
        }
    }

}
