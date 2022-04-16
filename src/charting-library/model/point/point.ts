/**
 * Point with X coordinate of generic type
 * @template X
 * */
export class Point<X> {

  /**
   * Point x coordinate.
   */
  x: X;

  /**
   * Point y coordinate.
   */
  y: number;

  /**
   * Creates abstract point with y coordinate.
   * @param {X} x - Point x coordinate.
   * @param {number} y - Point y coordinate.
   * @template X
   */
  constructor(x: X, y: number) {
    this.x = x;
    this.y = y;
  }
}
