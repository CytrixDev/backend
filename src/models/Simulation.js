const mongoose = require("mongoose");

const SimulationSchema = new mongoose.Schema({
  result: mongoose.Schema.Types.Mixed,
  parameters: mongoose.Schema.Types.Mixed,
  user: String,
});

module.exports = mongoose.model("Simulation", SimulationSchema);
