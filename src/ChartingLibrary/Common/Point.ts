export class Point {

  /**
   * Point x coordinate.
   */
  x: number;

  /**
   * Point y coordinate.
   */
  y: number;

  /**
   * Creates point with x and y coordinates.
   * @param {number} x - Point x coordinate.
   * @param {number} y - Point y coordinate.
   */
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Compares x coordinates of two points.
   * @param {Point} point1 - First point to compare.
   * @param {Point} point2 - Second point to compare.
   * @returns {number}
   */
  static compareByX(point1: Point, point2: Point): number {
    if (point1.x < point2.x)
      return -1;
    else if (point1.x > point2.x)
      return 1;
    return 0;
  }
}
