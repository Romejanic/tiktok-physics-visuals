import Simulation from "./sim";
import BeeDroppingBalls from "./simulations/bee_drop";
import BouncingBall from "./simulations/bouncing_ball";
import RandomCircles from "./simulations/random_circles";

interface SimulationClass {
    new(width: number, height: number): Simulation
}

const simulations: Record<string, SimulationClass> = {
    "bouncing_ball": BouncingBall,
    "random_circles": RandomCircles,
    "bee_drop_balls": BeeDroppingBalls
};

export default simulations;
