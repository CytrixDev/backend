const router = require("express").Router();
const SimulationController = require("../controller/Simulation");
router.get('/',SimulationController.createSimulation);

module.exports = router;
