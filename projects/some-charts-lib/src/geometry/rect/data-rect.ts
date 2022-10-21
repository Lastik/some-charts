import {Range} from '../range';
import {Point} from '../point';

export class DataRect<XType extends number | string | Date, YType extends  number | string | Date> {

  readonly minX: XType;
  readonly minY: YType;
  readonly maxX: XType;
  readonly maxY: YType;

  /**
   * Creates data rectangle.
   * @template XType
   * @template YType
   * @param {XType} minX - Left corner of rectangle coordinate.
   * @param {YType} minY - Top corner of rectangle coordinate.
   * @param {XType} maxX - Right corner of rectangle coordinate.
   * @param {YType} maxY - Bottom corner of rectangle coordinate.
   */
  constructor(minX: XType, minY: YType, maxX: XType, maxY: YType) {
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
  }

  /**
   * Returns horizontal range for this data rectangle.
   * @returns {Range}
   */
  getHorizontalRange(): Range<XType> {
    return new Range<XType>(this.minX, this.maxX);
  }

  /**
   * Returns vertical range for this data rectangle.
   * @returns {Range}
   */
  getVerticalRange(): Range<YType> {
    return new Range<YType>(this.minY, this.maxY);
  }
}
