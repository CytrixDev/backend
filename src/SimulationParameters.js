export default class SimulationParameters {
  constructor({
    m = 100, // area width .. area=m^2
    eelec = 50e-9, // Digital processing energy (nJ/bit)
    efs = 10e-12, // Transmition energy in free-space propagation (pJ/bit/m^2)
    emp = 0.0013e-12, // Transmition energy in multi-path propagation (pJ/bit/m^4)
    eda = 5e-9, // Energy consumption for data aggregation (nJ/bit/signal)
    initial_energy = 2, // Initial Node Energy (J)
    reporting_interval = 1, // reporting interval (Hour)
    cluster_reformation_interval = 1, // (Week)
    packet_size = 200, // Packet Size per node per report (bytes)
    t_max = 20, // Maximally allowed number of iterations
    sigma = 0.001, // Stopping condition
    n = 100, // number of nodes
    P = 0.08, // the desired precentage of cluster heads
    rate = 1, //
  } = {}) {
    this.eelec = eelec;
    this.efs = efs;
    this.emp = emp;
    this.eda = eda;
    this.initial_energy = initial_energy;
    this.reporting_interval = reporting_interval;
    this.cluster_reformation_interval = cluster_reformation_interval;
    this.packet_size = packet_size;
    this.t_max = t_max;
    this.sigma = sigma;
    this.n = n;
    this.m = m;
    this.P = P;
    this.rate = rate;
  }
}
