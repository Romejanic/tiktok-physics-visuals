import Simulation from "./sim";
import BouncingBall from "./simulations/bouncing_ball";

interface SimulationClass {
    new(width: number, height: number): Simulation
}

const simulations: Record<string, SimulationClass> = {
    "bouncing_ball": BouncingBall
};

export default simulations;
