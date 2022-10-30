import {Size} from '../size';
import {DataRect} from "./data-rect";
import {NumericPoint, Point} from "../point";
import {Range} from "../range";
import {NumericRange} from "../numeric-range";

export class NumericDataRect extends DataRect<number, number> {

  get width(): number {
    return this.maxX - this.minX;
  }

  get height(): number{
    return this.maxY - this.minY;
  }

  /**
   * Creates numeric data rectangle.
   * @param {number} minX - Left corner of rectangle coordinate.
   * @param {number} maxX - Right corner of rectangle coordinate.
   * @param {number} minY - Top corner of rectangle coordinate.
   * @param {number} maxY - Bottom corner of rectangle coordinate.
   */
  constructor(minX: number, maxX: number, minY: number, maxY: number) {
    super(minX, maxX, minY, maxY);
  }

  /**
   * Creates numeric data rectangle.
   * @param {number} minX - Left corner of rectangle coordinate.
   * @param {number} width - Rectangle width.
   * @param {number} minY - Top corner of rectangle coordinate.
   * @param {number} height - Rectangle height.
   */
  static override apply(minX: number, minY: number, width: number, height: number): NumericDataRect {
    return new NumericDataRect(minX, minX + width, minY, minY + height)
  }

  /**
   * Returns data rectangle size.
   * @returns {Size}
   */
  getSize() {
    return new Size(this.width, this.height);
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
  getMaxXMaxY(): NumericPoint{
    return new NumericPoint(this.maxX, this.maxY);
  }

  /**
   * Returns data rectangle center.
   * @returns {NumericPoint}
   */
  getCenter(): NumericPoint {
    return new NumericPoint((this.minX + this.maxX) / 2, (this.minY + this.maxY) / 2);
  }

  /**
   * Creates new DataRect with specified width
   * @param {number} width - new width
   * @returns NumericDataRect
   * */
  withWidth(width: number): NumericDataRect {
    return new NumericDataRect(this.minX, this.maxX, this.minY + width, this.minY);
  }

  /**
   * Creates new DataRect with specified height
   * @param {number} height - new height
   * @returns NumericDataRect
   * */
  withHeight(height: number): NumericDataRect{
    return new NumericDataRect(this.minX, this.maxX, this.minY, this.minY + height);
  }

  /**
   * Merges one data rectangle with other data rectangle.
   * @param {DataRect} other - Other rectangle.
   * @returns {DataRect}
   */
  merge(other: NumericDataRect): NumericDataRect {
    let thisMinXminY = this.getMinXMinY();
    let thisMaxXmaxY = this.getMaxXMaxY();

    let otherMinXminY = other.getMinXMinY();
    let otherMaxXmaxY = other.getMaxXMaxY();

    let minX = Math.min(thisMinXminY.x, otherMinXminY.x);
    let maxX = Math.max(thisMaxXmaxY.x, otherMaxXmaxY.x);

    let minY = Math.min(thisMinXminY.y, otherMinXminY.y);
    let maxY = Math.max(thisMaxXmaxY.y, otherMinXminY.y);


    return new NumericDataRect(minX, maxX, minY, maxY);
  }

  /**
   * Returns horizontal range for this data rectangle.
   * @returns {Range}
   */
  override getHorizontalRange(): NumericRange {
    return new NumericRange(this.minX, this.maxX);
  }

  /**
   * Returns vertical range for this data rectangle.
   * @returns {Range}
   */
  override getVerticalRange(): NumericRange {
    return new NumericRange(this.minY, this.maxY);
  }
}
