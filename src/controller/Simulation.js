// eslint-disable-next-line no-unused-vars
const SimulationModel = require("../models/Simulation");
const Simulation = require("../Simulation").default;

module.exports = {
  // eslint-disable-next-line no-unused-vars
  createSimulation: async (req, res, next) => {
    const sim = new Simulation();
    sim.initialize();
    sim.run();
    // eslint-disable-next-line no-unused-vars
    const sim_params = sim.rounds[0].parameters;
    sim.rounds.forEach((round) => {
      delete round.id;
      round.frames.forEach((frame) => {
        delete round.nodes;
        delete frame.id;
        delete round.parameters;
        delete round.clusters;
        frame.clusters.forEach((cluster) => {
          delete cluster.id;
          delete cluster.ch.sim_params;
          delete cluster.ch.cluster_nodes;
          delete cluster.cluster_nodes;
          cluster.nodes.forEach((node) => {
            delete node.recivedAdvertisementMessages;
            delete node.sim_params;
          });
        });
      });
    });

    res.json({ sim: sim.rounds, user: req.user });
  },
};
