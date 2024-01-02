import Graphics from "../drawing";
import { TWO_PI, randomColor, vec2, vec2_add, vec2_distance, vec2_length, vec2_normalize, vec2_scale, vec2_sub } from "../math";
import Simulation from "../sim";

const SPAWN_INTERVAL = 5;
const GAP_SIZE = 0.3;
const SPAWN_SIZE = 45;

interface Ball {
    position: vec2;
    velocity: vec2;
    size: number;
    color: string;
    bounced: boolean;
}

export default class BeeDroppingBalls extends Simulation {

    balls = new Array<Ball>();
    spawnTimer = 0;

    // debugPoints = new Array<vec2>();

    private readonly center: vec2;
    private readonly spawnPoint: vec2;

    constructor(w: number, h: number) {
        super(w, h);
        this.center = [ this.width/2, this.height/2 ];
        this.spawnPoint = [ this.width/2, this.height/2-this.width/3 ];
    }

    get duration(): number {
        return 30;
    }

    init(): void {
        this.spawnTimer = 0;
        this.balls.splice(0);
        this.newBall();

        // this.debugPoints = [
        //     [ this.spawnPoint[0], this.spawnPoint[1]+8 ],
        //     [ this.spawnPoint[0], this.spawnPoint[1]-50 ]
        // ];
    }

    draw(g: Graphics): void {
        // debug: draw starting range
        // g.fillColor("blue");
        // g.circle(this.width/2, this.height/2-this.width/3, SPAWN_SIZE);
        // g.fillColor("red");
        // for(const p of this.debugPoints) {
        //     g.circle(...p, 5);
        // }

        // draw all balls
        for(const b of this.balls) {
            g.fillColor(b.color);
            g.circle(...b.position, b.size, true);
        }

        // draw test tube shape
        g.translate(...this.center);
        g.rotate(-Math.PI / 2);
        g.strokeSize(2);
        g.strokeColor("black");
        g.arc(0, 0, this.width/3, GAP_SIZE, TWO_PI-GAP_SIZE);
        g.reset();

        // draw neck of tube
        g.line(this.spawnPoint[0]-SPAWN_SIZE, this.spawnPoint[1]+8, this.spawnPoint[0]-SPAWN_SIZE, this.spawnPoint[1]-50);
        g.line(this.spawnPoint[0]+SPAWN_SIZE, this.spawnPoint[1]+8, this.spawnPoint[0]+SPAWN_SIZE, this.spawnPoint[1]-50);
    }

    simulate(delta: number): void {
        this.spawnTimer += delta;

        // spawn new balls at each spawn interval
        if(this.spawnTimer >= SPAWN_INTERVAL) {
            this.spawnTimer = 0;
            this.newBall();
        }

        // simulate balls
        const forRemoval = [];
        for(const i in this.balls) {
            const b = this.balls[i];
            const gravity = 980 * delta;
            b.velocity = vec2_add(b.velocity, [0, gravity]);
            b.position = vec2_add(b.position, vec2_scale(b.velocity, delta));
            // remove ball if it's gone offscreen
            if(b.position[1] > this.height+b.size) {
                forRemoval.push(i);
            }
            // test for collision with edge
            if(this.isTouchingSide(b)) {
                const normal = vec2_normalize(vec2_sub(this.center, b.position));
                const side = this.sideOfGlass(b, normal);
                let bounceBias = 1;
                if(!b.bounced) {
                    b.bounced = true;
                    bounceBias = 0.9;
                }
                const force = vec2_length(b.velocity) * -side;
                b.velocity = vec2_scale(normal, force * bounceBias);
                // prevent ball from going through wall
                b.position = vec2_sub(this.center, vec2_scale(normal, this.width/3+b.size*side));
            }
            // test for collision with neck
            if(this.isTouchingNeck(b)) {
                const side = Math.sign(b.position[0] - this.spawnPoint[0]);
                b.velocity[0] *= -1;
                b.position[0] = (this.spawnPoint[0] + SPAWN_SIZE * side) - b.size * side;
            }
            // test for collisions with other balls
            for(const j in this.balls) {
                if(i === j) continue;
                const other = this.balls[j];
                if(this.isTouchingOtherBall(b, other)) {
                    const collisionNormal = vec2_normalize(vec2_sub(other.position, b.position));
                    const force = (vec2_length(b.velocity) + vec2_length(other.velocity)) / 2;
                    other.velocity = vec2_scale(collisionNormal, force);
                    b.velocity = vec2_scale(collisionNormal, -force);
                }
            }
        }

        // remove any balls marked for removal
        this.balls = this.balls.filter((_,i) => !forRemoval.includes(String(i)));
    }

    newBall() {
        const jitterX = Math.random() * 8 - 4;
        this.balls.push({
            position: vec2_add(this.spawnPoint, [jitterX, -150]),
            velocity: [Math.random() * 10 - 5, 0],
            size: 10,
            color: randomColor(),
            bounced: false
        });
    }

    isTouchingSide(b: Ball) {
        if(vec2_distance(b.position, this.spawnPoint) < SPAWN_SIZE) return false;
        const distance = vec2_distance(b.position, this.center);
        return distance > this.width/3-b.size-0.1 && distance < this.width/3+b.size+0.1;
    }

    isTouchingNeck(b: Ball) {
        const touchingX1 = Math.abs(b.position[0] - this.spawnPoint[0]-SPAWN_SIZE) <= b.size;
        const touchingX2 = Math.abs(b.position[0] - this.spawnPoint[0]+SPAWN_SIZE) <= b.size;
        const touchingY = b.position[1] <= this.spawnPoint[1]+8-b.size && b.position[1] >= this.spawnPoint[1]-50+b.size;
        return (touchingX1 || touchingX2) && touchingY;
    }

    isTouchingOtherBall(a: Ball, b: Ball) {
        const dist = vec2_distance(a.position, b.position);
        return dist <= (a.size + b.size);
    }

    sideOfGlass(b: Ball, normal: vec2) {
        // stop balls phasing through glass at the bottom
        if(normal[1] < -0.25) return -1;
        const distance = vec2_distance(b.position, this.center) - b.size/2;
        return Math.sign(distance - (this.width/3));
    }

}
