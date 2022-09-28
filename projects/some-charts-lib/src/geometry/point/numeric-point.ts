import {Point} from "./point";

/**
 * Point with numeric X coordinate.
 */
export class NumericPoint extends Point<number>{

  /**
   * Creates point with x and y coordinates.
   * @param {number} x - Point x coordinate.
   * @param {number} y - Point y coordinate.
   */
  constructor(x: number, y: number) {
    super(x, y);
  }

  /**
   * Adds other NumericPoint to this one.
   * @param {NumericPoint} other - Other point.
   * @returns {NumericPoint}
   */
  scalarPlus(other: NumericPoint): NumericPoint{
    return new NumericPoint(this.x + other.x, this.y + other.y);
  }

  /**
   * Compares x coordinates of two numeric points.
   * @param {NumericPoint} point1 - First point to compare.
   * @param {NumericPoint} point2 - Second point to compare.
   * @returns {number}
   */
  static compareByX(point1: NumericPoint, point2: NumericPoint): number {
    if (point1.x < point2.x)
      return -1;
    else if (point1.x > point2.x)
      return 1;
    return 0;
  }
}
