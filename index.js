import Simulation from "./src/Simulation";


const sim = new Simulation();
sim.__init__();

sim.nodes.forEach((node) => {
  console.log(`${node.pos.x}, ${node.pos.y}`);
});
