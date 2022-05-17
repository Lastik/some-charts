import {NumericRange} from './numeric-range';
import {Size} from './size';
import {NumericPoint} from './point/numeric-point';

export class DataRect {

  readonly minX: number;
  readonly minY: number;
  readonly width: number;
  readonly height: number;

  /**
   * Creates data rectangle.
   * @param {number} minX - Left corner of rectangle coordinate.
   * @param {number} minY - Top corner of rectangle coordinate.
   * @param {number} width - Rectangle width.
   * @param {number} height - Rectangle height.
   */
  constructor(minX: number, minY: number, width: number, height: number) {
    this.minX = minX;
    this.minY = minY;
    this.width = width;
    this.height = height;
  }

  /**
   * Returns horizontal range for this data rectangle.
   * @returns {Range}
   */
  getHorizontalRange(): NumericRange {
    return new NumericRange(this.minX, this.minX + this.width, false);
  }

  /**
   * Returns vertical range for this data rectangle.
   * @returns {Range}
   */
  getVerticalRange(): NumericRange {
    return new NumericRange(this.minY, this.minY + this.height, false);
  }

  /**
   * Left Top corner of data rectangle.
   * @returns {NumericPoint}
   */
  getMinXMinY(): NumericPoint {
    return new NumericPoint(this.minX, this.minY);
  }

  /**
   * Right Bottom corner of data rectangle.
   * @returns {NumericPoint}
   */
  getMaxXMaxY(): NumericPoint {
    return new NumericPoint(this.minX + this.width, this.minY + this.height);
  }

  /**
   * Returns data rectangle size.
   * @returns {Size}
   */
  getSize() {
    return new Size(this.width, this.height);
  }

  /**
   * Returns data rectangle center.
   * @returns {NumericPoint}
   */
  getCenter() {
    return new NumericPoint(this.minX + this.width / 2, this.minY + this.height / 2);
  }

  /**
   * Merges one data rectangle with other data rectangle.
   * @param {DataRect} other - Other rectangle.
   * @returns {DataRect}
   */
  merge(other: DataRect): DataRect {
    let thisMinXminY = this.getMinXMinY();
    let thisMaxXmaxY = this.getMaxXMaxY();

    let otherMinXminY = other.getMinXMinY();
    let otherMaxXmaxY = other.getMaxXMaxY();

    let minX = Math.min(thisMinXminY.x, otherMinXminY.x);
    let minY = Math.min(thisMinXminY.y, otherMinXminY.y);

    let maxX = Math.max(thisMaxXmaxY.x, otherMaxXmaxY.x);
    let maxY = Math.max(thisMaxXmaxY.y, otherMinXminY.y);

    return new DataRect(minX, minY, maxX - minX, maxY - minY);
  }
}
