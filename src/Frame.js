import cuid from "cuid";

export default class Frame {
  constructor({ clusters } = {}) {
    this.id = cuid();
    this.clusters = clusters;
  }
}
