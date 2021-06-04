import Position from "../Position";

export default function (m) {
  const x = Math.floor(Math.random() * m);
  const y = Math.floor(Math.random() * m);
  return new Position({ x, y });
}
