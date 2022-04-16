import {Point} from "./point/point";

/**
 * DataSeries with X coordinate of generic type
 * @template X
 */
export class DataSeries<X> {

  readonly data: Array<Point<X>>;
  readonly ordered: boolean;

  name: string;
  color: string;

  /**
   * Represents event occurring on multitouch navigation.
   * @param {Array<Point<X>>} data - Data series data array.
   * @param {boolean} ordered - Indicates whether DataSeries points are ordered or not.
   * @param {string} name - Data series name.
   * @param {string} color - Data series color.
   */
  constructor(data: Array<Point<X>>, ordered: boolean, name: string, color: string) {
    this.data = data;
    this.ordered = ordered;
    this.name = name;
    this.color = color;
  }
}
