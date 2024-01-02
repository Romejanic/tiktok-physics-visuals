import { vec2, vec2_add, vec2_scale } from "../math";
import Simulation from "../sim";
import Graphics from "../drawing";

interface Ball {
    position: vec2;
    velocity: vec2;
    size: number;
}

export default class BouncingBall extends Simulation {

    balls = new Array<Ball>();

    init(): void {
        this.balls.splice(0);
        this.balls.push({
            position: [ this.width/2, this.height/10 ],
            velocity: [ 0, 0 ],
            size: 20.0
        });
    }

    simulate(delta: number): void {
        for(const ball of this.balls) {
            let yVel = ball.velocity[1];
            // apply gravity
            yVel += 980 * delta;
            // check for collision with ground
            // also only bounce if ball is heading towards ground
            const maxY = this.height/2+50-ball.size;
            if(ball.position[1] >= maxY && Math.sign(yVel) > 0) {
                yVel *= -0.9;
            }
            // move ball based on velocity
            ball.velocity = [0, yVel];
            ball.position = vec2_add(ball.position, vec2_scale(ball.velocity, delta));
            ball.position[1] = Math.min(ball.position[1], maxY);
        }
    }
    
    draw(g: Graphics): void {
        // draw each ball
        for(const ball of this.balls) {
            g.fillColor("red");
            g.circle(...ball.position, ball.size);
        }

        // draw ground
        g.strokeSize(2.5);
        g.strokeColor("black");
        g.line(this.width/2-200, this.height/2+50, this.width/2+200, this.height/2+50);
    }

    get duration() {
        return 10.0;
    }

}
