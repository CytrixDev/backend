import SimulationParameters from "./SimulationParameters";
import Node from "./Nodes";
import randPos from "./helpers/randPos";
import cuid from "cuid";
import Round from "./Round";
import { BaseStation } from "./Nodes";
import Position from "./Position";

export default class Simulation {
  constructor({ parameters = new SimulationParameters() } = {}) {
    this.parameters = parameters;
    this.rounds = [];
  }

  initialize() {
    this.nodes = [];
    for (let i = 0; i < this.parameters.n; i++) {
      let n_pos = randPos(this.parameters.m);
      while (
        this.nodes.filter((x) => x.pos.x == n_pos.x && x.pos.y == n_pos.y)
          .length !== 0
      ) {
        n_pos = randPos(this.parameters.m);
      }
      this.nodes.push(new Node({ pos: n_pos, sim_params: this.parameters }));
    }
  }
  run() {
    const bs = new BaseStation({ pos: new Position({ x: 20, y: 20 }) });
    let current_round = 1;
    let round = new Round({
      parameters: this.parameters,
      r: 1,
      nodes: this.nodes,
      bs: bs,
    });
    let clusters = round.setup({
      g: this.nodes.filter((n) => n.times_been_ch == 0),
    });
    let frames = round.steady_state();
    this.rounds.push(round);
    console.time("sim");
    while (current_round < 20 && round.hasLiveNodes()) {
      current_round++;
      console.log(current_round);
      this.nodes = [];
      frames[frames.length - 1].clusters.map((c) => {
        this.nodes.push(c.ch);
        c.nodes.forEach((n) => {
          this.nodes.push(n);
        });
      });
      round = new Round({
        parameters: this.parameters,
        r: current_round,
        nodes: this.nodes,
        bs: bs,
      });
      clusters = round.setup({
        g: this.nodes.filter((n) => n.times_been_ch == 0),
      });
      frames = round.steady_state();
      this.rounds.push(round);
    }
    console.timeEnd("sim");
  }
}

//class PacketBasedEnergyConsumptionModel {}
