import random from "./helpers/random";

export default class Frame {
  constructor({ clusters } = {}) {
    this.id = random();
    this.clusters = clusters;
  }
}
