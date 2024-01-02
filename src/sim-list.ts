import Simulation from "./sim";
import BouncingBall from "./simulations/bouncing_ball";
import RandomCircles from "./simulations/random_circles";

interface SimulationClass {
    new(width: number, height: number): Simulation
}

const simulations: Record<string, SimulationClass> = {
    "bouncing_ball": BouncingBall,
    "random_circles": RandomCircles
};

export default simulations;
