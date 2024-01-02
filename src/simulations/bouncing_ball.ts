import { CanvasRenderingContext2D } from "canvas";
import { vec2, vec2_add, vec2_scale } from "../math";
import Simulation from "../sim";

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
            position: [ this.width/2, this.height/2-50 ],
            velocity: [ 0, 0 ],
            size: 20.0
        });
    }

    simulate(delta: number): void {
        for(const ball of this.balls) {
            let yVel = ball.velocity[1];
            // apply gravity
            yVel -= 98 * delta;
            // check for collision with ground
            if(ball.position[1] <= this.height/2+50-(ball.size/2)) {
                yVel *= -0.9;
            }
            // move ball based on velocity
            ball.velocity = [0, yVel];
            ball.position = vec2_add(ball.position, vec2_scale(ball.velocity, ball.size * delta));
        }
    }
    
    draw(ctx: CanvasRenderingContext2D): void {
        // draw each ball
        for(const ball of this.balls) {
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(...ball.position, ball.size, 0, 2*Math.PI, false);
            ctx.fill();
        }

        // draw ground
        ctx.strokeStyle = "15px solid black";
        ctx.beginPath();
        ctx.moveTo(this.width/2-200, this.height/2+50);
        ctx.lineTo(this.width/2+200, this.height/2+50);
        ctx.stroke();
    }

}
