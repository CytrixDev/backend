const Simulation = require("../Simulation").default;

module.exports = {
  createSimulation: async (req, res) => {
    const simulation = new Simulation();
    simulation.__init__();
    simulation.run();
    const simulation_params = simulation.rounds[0].parameters;
    simulation.rounds.forEach((round) => {
      delete round.id;
      round.frames.forEach((frame) => {
        delete round.nodes;
        delete frame.id;
        delete round.parameters;
        delete round.clusters;
        frame.clusters.forEach((cluster) => {
          delete cluster.id;
          delete cluster.ch.simulation_params;
          delete cluster.ch.cluster_nodes;
          delete cluster.cluster_nodes;
          cluster.nodes.forEach((node) => {
            delete node.recivedAdvertisementMessages;
            delete node.simulation_params;
          });
        });
      });
    });

    res.json({ simulation: simulation.rounds, user: req.user });
  },
};
