export default class Position {
  constructor({ x, y } = {}) {
    this.x = x;
    this.y = y;
  }
  distance(other) {
    if (other && other instanceof Position) {
      return Math.sqrt(
        Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2)
      );
    } else {
      throw new Error(`${other} is not of type 'Position'`);
    }
  }
}
