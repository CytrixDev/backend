import Simulation from "./src/Simulation";

const sim = new Simulation();

console.log(sim);

sim.initialize();

console.log(sim);

sim.nodes.forEach((node) => {
  console.log(`${node.pos.x}, ${node.pos.y}`);
});
