import cuid from "cuid";

export default class Node {
  constructor({ pos, sim_params } = {}) {
    this.id = cuid();
    this.initial_energy = sim_params.initial_energy;
    this.energy = this.initial_energy;
    this.sim_params = sim_params;
    this.pos = pos;
    this.times_been_ch = 0;
  }
  isDead() {
    return this.energy <= 0;
  }
  //  The energy required to transmit b bits at distance d
  transmitionEnergyConsumption({ b, d } = {}) {
    if (d < this.sim_params.sigma) {
      return b * this.sim_params.eelec + b * this.sim_params.efs * d ** 2;
    } else {
      return b * this.sim_params.eelec + b * this.sim_params.efs * d ** 4;
    }
  }

  //  The energy required to recive b bits at distance d
  recivingEnergyConsumption({ b, d } = {}) {
    return b * this.sim_params.eelec;
  }

  threshold_T({ P, r, g = [] } = {}) {
    const n_in_g = g.filter((x) => x.id === this.id).length > 0;
    if (n_in_g) {
      return P / (1 - P * (r % (1 / P)));
    }
    return 0;
  }
  wantToBeCH({ P, r, g = [] } = {}) {
    const rn = Math.random();
    const T = this.threshold_T({ P, r, g });
    return rn < T ? true : false;
  }

  copy() {
    const new_node = new Node({
      pos: this.pos,
      sim_params: this.sim_params,
    });
    new_node.id = this.id;
    new_node.energy = this.energy;
    new_node.times_been_ch = this.times_been_ch;
    //new_node.sim_params = this.sim_params;
    return new_node;
  }
  copy_to_ch() {
    const new_node = new CHNode({
      pos: this.pos,
      sim_params: this.sim_params,
    });
    new_node.id = this.id;
    new_node.energy = this.energy;
    new_node.times_been_ch = this.times_been_ch + 1;
    //new_node.sim_params = this.params;
    return new_node;
  }
  copy_to_cm() {
    const new_node = new CMNode({
      sim_params: this.sim_params,
      pos: this.pos,
    });
    new_node.id = this.id;
    new_node.energy = this.energy;
    new_node.times_been_ch = this.times_been_ch;
    //new_node.sim_params = this.sim_params;
    return new_node;
  }
}

class CHNode extends Node {
  constructor({ sim_params, pos } = {}) {
    super({ sim_params, pos });
    this.type = "CH";
    this.cluster_nodes = [];
  }

  energyConsumptionOfCH({ n, b, d, sim_params } = {}) {
    return (
      (n - 1) * b * sim_params.eelec +
      n * b * sim_params.eda +
      b * sim_params.eelec +
      b * sim_params.emp * d ** 4
    );
  }
  sendAdvertisementMessage({ node } = {}) {
    node.reciveAdvertisementMessage({ senderNode: this, message: "somedata" });
  }
  reciveMessageFromCM({ node } = {}) {
    this.cluster_nodes.push(node.id);
  }
}

export class CMNode extends Node {
  constructor({ sim_params, pos } = {}) {
    super({ sim_params, pos });
    this.type = "CM";
    this.belongs_to = null;
    this.recivedAdvertisementMessages = [];
  }

  energyConsumptionOfCM({ b, d, sim_params } = {}) {
    return b * sim_params.eelec + b * sim_params.efs * d ** 2;
  }
  reciveAdvertisementMessage({ senderNode, message } = {}) {
    this.recivedAdvertisementMessages.push({ senderNode, message });
  }
  decideClusterHead() {
    const min_distance = this.recivedAdvertisementMessages
      .map((message) => {
        const distance = this.pos.distance(message.senderNode.pos);
        return { id: message.senderNode.id, distance };
      })
      .reduce(
        (acc, cur) => {
          if (acc.distance > cur.distance || acc.id == "") {
            return cur;
          }
          return acc;
        },
        { distance: 100, id: "" }
      );
    return min_distance;
  }
}

export class BaseStation {
  constructor({ pos } = {}) {
    this.pos = pos;
  }
}

export class Cluster {
  constructor({ nodes = [], ch = null } = {}) {
    this.id = cuid();
    this.ch = ch;
    this.nodes = nodes;
  }
  add_node({ node } = {}) {
    this.nodes.push(node);
  }
  // Time cluster formation
  static tcf({ N, b, rate } = {}) {
    return (2 * N * b * 8) / (rate * 10 ** 6);
  }
  copy() {
    const n_cluster = new Cluster({
      nodes: this.nodes.map((node) => node.copy_to_cm()),
      ch: this.ch.copy_to_ch(),
      id: this.id,
    });
    n_cluster.ch.times_been_ch = this.times_been_ch;
    return n_cluster;
  }
}
