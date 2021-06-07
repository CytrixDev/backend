import random from "./helpers/random";
import { Cluster } from "./Nodes";
import Frame from "./Frame";

export default class Round {
  constructor({ parameters, r, nodes, bs } = {}) {
    this.id = random();
    this.parameters = parameters;
    this.nodes = nodes.map((node) => node.copy());
    this.r = r;
    this.frames = [];
    this.clusters = [];
    this.bs = bs;
  }

  setup({ g } = {}) {
    // CLUSTERS FORMATION
    const clusters = [];

    // EACH NODE DECIDES WETHER TO BE A CH OR NOT

    for (let i = 0; i < this.parameters.n; i++) {
      let current_node = this.nodes[i];
      if (current_node.wantToBeCH({ P: this.parameters.P, r: 1, g })) {
        this.nodes[i] = current_node.copy_to_ch();
        const cluster = new Cluster({ ch: this.nodes[i] });
        clusters.push(cluster);
      } else {
        this.nodes[i] = current_node.copy_to_cm();
      }
    }

    // CH NODES SEND ADVERTISMENT MESSAGES

    this.nodes.forEach((node) => {
      if (node.type == "CH") {
        this.nodes.forEach((n_node) => {
          if (n_node.type == "CM") {
            node.sendAdvertisementMessage({ node: n_node });
          }
        });
      }
    });
    // CM NODES DECIDE THE CH HEAD TO BELONG TO AND BROADCASTS THE MESSAGE TO CH
    // CH NODE RECIVES MESSAGES FROM CM NODES TO CREATE TABLE
    this.nodes.forEach((node) => {
      if (node.type == "CM") {
        const ch = node.decideClusterHead();
        node.belongs_to = ch.id;
        const ch_node = this.nodes.filter((n) => n.id == ch.id)[0];
        console.log(ch_node)
        //ch_node.reciveMessageFromCM({ node });
        const current_cluster = clusters.filter(
          (clus) => clus.ch.id == ch_node.id
        )[0];
        current_cluster.add_node({ node });
      }
    });

    // SINCE WE CAN LOOP TRHOUGH THE CLUSTER NODES ONE AT TIME
    // THERE IS NO NEED FOR A TDMA TABLE SINCE LOOPING ONE AT A TIME
    // IS IN THEORY SOME SORT OF A TDMA TABLE I.E THERE WILL BE NO
    // TWO NODES SENDING DATA AT THE SAME TIME

    this.clusters = clusters;
    return clusters;
  }
  steady_state() {
    const state_frames = [];
    // Calculate cluster fromation time
    const clusterReformationTime = Cluster.tcf({
      N: this.parameters.n,
      b: this.parameters.packet_size,
      rate: this.parameters.rate,
    });
    // calculate number of frames in a round
    const num_of_frames = Round.framesPerRound({
      clusterReformationTime,
      clusterReformationInterval: this.parameters.cluster_reformation_interval,
      reportingInterval: this.parameters.reporting_interval,
    });
    for (let i = 0; i < num_of_frames; i++) {
      const n_frame = this.generate_frame();
      this.frames.push(n_frame);
    }
    return this.frames;
  }
  generate_frame() {
    const frame_clusters =
      this.frames.length > 0
        ? this.frames[this.frames.length - 1].clusters.map((cluster) =>
            cluster.copy()
          )
        : this.clusters.map((cluster) => cluster.copy());
    frame_clusters.forEach((cluster) => {
      const ch = cluster.ch;
      cluster.nodes.forEach((node) => {
        if (node.energy > 0) {
          node.energy =
            node.energy -
            node.transmitionEnergyConsumption({
              b: this.parameters.packet_size,
              d: node.pos.distance(ch.pos),
            });
        }
        if (ch.energy > 0) {
          ch.energy =
            ch.energy -
            ch.recivingEnergyConsumption({ b: this.parameters.packet_size });
        }
      });
      if (ch.energy > 0) {
        ch.energy =
          ch.energy -
          ch.transmitionEnergyConsumption({
            b: this.parameters.packet_size,
            d: ch.pos.distance(this.bs.pos),
          });
      }
      //ch.sendDataToBS({ bs: this.bs });
    });
    const frame = new Frame({ clusters: frame_clusters });
    return frame;
  }

  hasLiveNodes() {
    let has_live_nodes = false;
    this.frames[this.frames.length - 1].clusters.forEach((cluster) => {
      if (!cluster.ch.isDead()) {
        has_live_nodes = true;
      }
      cluster.nodes.forEach((n) => {
        if (!n.isDead()) {
          has_live_nodes = true;
        }
      });
    });
    return has_live_nodes;
  }

  static framesPerRound({
    clusterReformationInterval,
    clusterReformationTime,
    reportingInterval,
  } = {}) {
    return Math.floor(
      (clusterReformationInterval * 7 * 24 * 60 * 60 - clusterReformationTime) /
        (reportingInterval * 60 * 60)
    );
  }
}
