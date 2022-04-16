import {Point} from "./point";

/**
 * Point with string X coordinate.
 */
export class StringPoint extends Point<string>{

  /**
   * Creates point with x and y coordinates.
   * @param {string} x - Point x coordinate.
   * @param {number} y - Point y coordinate.
   */
  constructor(x: string, y: number) {
    super(x, y);
  }
}
