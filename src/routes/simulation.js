const router = require("express").Router();
const SimulationController = require("../controller/Simulation");
router.route("/").get(SimulationController.createSimulation);

module.exports = router;
