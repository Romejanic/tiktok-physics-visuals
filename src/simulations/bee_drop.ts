import Graphics from "../drawing";
import { TWO_PI, lerp, randomColor, vec2, vec2_add, vec2_distance, vec2_length, vec2_normalize, vec2_scale, vec2_sub } from "../math";
import Simulation from "../sim";

const SPAWN_INTERVAL = 2.5;
const GAP_SIZE = 0.3;
const SPAWN_SIZE = 45;
const SPAWN_OFFSET = 100;
const BALL_SIZE = 10;

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
    nextBallColor = "black";
    beeLastPos: vec2 = [0, 0];
    beeVelocity: vec2 = [0, 0];

    // debugPoints = new Array<vec2>();

    private readonly center: vec2;
    private readonly spawnPoint: vec2;

    constructor(w: number, h: number) {
        super(w, h);
        this.center = [ this.width/2, this.height/2 ];
        this.spawnPoint = [ this.width/2, this.height/2-this.width/3 ];
    }

    get duration(): number {
        return 60;
    }

    init(): void {
        this.spawnTimer = 0;
        this.balls.splice(0);
        this.beeLastPos = [-50, this.spawnPoint[1]];
        this.beeVelocity = [0, 0];
        this.nextBallColor = randomColor();
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
        g.strokeSize(2);
        g.strokeColor("black");

        // draw all balls
        for(const b of this.balls) {
            g.fillColor(b.color);
            g.circle(...b.position, b.size, true);
        }

        // draw main bee
        const animT   = this.spawnTimer / SPAWN_INTERVAL;
        const animY   = Math.sin(animT * TWO_PI) * 25;
        const beePosX = lerp(-50, (this.width/2), animT);
        const beePosY = this.spawnPoint[1]-SPAWN_OFFSET-25+animY;
        // draw next ball under bee
        g.fillColor(this.nextBallColor);
        g.circle(beePosX, beePosY+25, BALL_SIZE, true);
        this.drawBee(g, beePosX, beePosY);

        // calculate bee velocity
        this.beeVelocity = vec2_scale(vec2_sub([beePosX, beePosY], this.beeLastPos), 10);
        this.beeLastPos = [beePosX, beePosY];

        // draw ghost bee to fly off screen
        const ghostPosX = lerp(this.width/2, this.width+50, animT);
        this.drawBee(g, ghostPosX, beePosY);

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

        // draw ball count
        g.font("Arial", 40);
        g.textAlign("center");
        g.text(`${this.balls.length} ball${this.balls.length === 1 ? "" : "s"}`, this.width/2, this.height/2+this.width/2);
    }

    drawBee(g: Graphics, x: number, y: number) {
        g.translate(x, y);
        g.fillColor("gray");
        g.triangle(-40, 0, -25, -5, -25, 5, true);
        g.fillColor("yellow");
        g.ellipse(0, 0, 30, 15, true);
        g.fillColor("black");
        g.rect(-20, -12, 5, 25);
        g.rect(-10, -15, 5, 30);
        g.rect(0, -15, 5, 30);
        g.fillColor("yellow");
        g.arc(34, -20, 15, 2.5, 5.3);
        g.ellipse(20, -10, 15, 11, true);
        g.fillColor("white");
        g.circle(28, -15, 5, true);
        g.arc(28, -20, 15, 2.5, 5.3);
        g.fillColor("black");
        g.circle(30, -15, 3);
        g.line(18, 13, 15, 25);
        g.line(5, 13, 2, 25);
        g.line(-8, 13, -10, 25);
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
            position: vec2_add(this.spawnPoint, [jitterX, -SPAWN_OFFSET]),
            velocity: vec2_add(this.beeVelocity, [Math.random() * 5, 0]),
            size: BALL_SIZE,
            color: this.nextBallColor,
            bounced: false
        });
        this.nextBallColor = randomColor();
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
