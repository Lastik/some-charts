import {Range} from '../model/range';
import {DataRect} from '../model/data-rect';
import {NumericPoint} from '../model/point/numeric-point';
import {NumericRange} from "../model/numeric-range";

export class CoordinateTransform {

  /**
   * Transforms value from data X coordinate to screen X coordinate.
   * @param {number} value - Data point X coordinate.
   * @param {Range} visible - Visible data range.
   * @param {number} screenWidth - Screen width.
   * @returns {number}
   */
  public static dataToScreenX(value: number, visible: NumericRange, screenWidth: number): number {
    return CoordinateTransform.dataToScreenDim(value, visible, screenWidth);
  }

  /**
   * Transforms value from data Y coordinate to screen Y coordinate.
   * @param {number} value - Data point Y coordinate.
   * @param {Range} visible - Visible data range.
   * @param {number} screenHeight - Screen height.
   * @returns {number}
   */
  public static dataToScreenY(value: number, visible: NumericRange, screenHeight: number): number {
    return screenHeight - CoordinateTransform.dataToScreenDim(value, visible, screenHeight);
  }

  private static dataToScreenDim(value: number, visible: NumericRange, screenDim: number): number {
    return (value - visible.min) * screenDim / (visible.max - visible.min);
  }

  /**
   * Transforms value from screen X coordinate to data X coordinate.
   * @param {number} value - Point on screen X coordinate.
   * @param {Range} visible - Visible data range
   * @param {number} screenWidth - Screen width.
   * @returns {number}
   */
  public static screenToDataX(value: number, visible: NumericRange, screenWidth: number): number {
    return value * (visible.max - visible.min) / screenWidth + visible.min;
  }

  /**
   * Transforms value from screen Y coordinate to data Y coordinate.
   * @param {number} value - Point on screen Y coordinate.
   * @param {Range} visible - Visible data range
   * @param {number} screenHeight - Screen height.
   * @returns {number}
   */
  public static screenToDataY(value: number, visible: NumericRange, screenHeight: number): number {
    return (screenHeight - value) * (visible.max - visible.min) / screenHeight + visible.min;
  }

  /**
   * Transforms point from XY coordinates in specified screen region to data XY coordinate.
   * @param {NumericPoint} value - Point in specified screen region coords.
   * @param {DataRect} visible - Visible data rectangle.
   * @param {DataRect} screenRegion - Screen region.
   * @returns {NumericPoint}
   */
  public static screenRegionToDataXY(value: NumericPoint, visible: DataRect, screenRegion: DataRect): NumericPoint {
    const x = value.x;
    const y = value.y;

    const leftTop = screenRegion.getMinXMinY();

    const newX = CoordinateTransform.screenToDataX(x - leftTop.x, visible.getHorizontalRange(), screenRegion.getHorizontalRange().getLength());
    const newY = CoordinateTransform.screenToDataY(y - leftTop.y, visible.getVerticalRange(), screenRegion.getVerticalRange().getLength());

    return new NumericPoint(newX, newY);
  }


  /**
   * Transforms rectangle from XY coordinates in specified screen region to data coordinates.
   * @param {NumericPoint} rect - DataRect in specified screen region coords.
   * @param {DataRect} visible - Visible data rectangle.
   * @param {DataRect} screenRegion - Screen region.
   * @returns {DataRect}
   */
  public static screenRegionToDataForRect(rect: DataRect, visible: DataRect, screenRegion: DataRect): DataRect {
    const leftTop = rect.getMinXMinY();
    const rightBottom = rect.getMaxXMaxY();

    const leftTopTransformed = CoordinateTransform.screenRegionToDataXY(leftTop, visible, screenRegion);
    const rightBottomTransformed = CoordinateTransform.screenRegionToDataXY(rightBottom, visible, screenRegion);

    return new DataRect(
      leftTopTransformed.x, leftTopTransformed.y,
      rightBottomTransformed.x - leftTopTransformed.x,
      rightBottomTransformed.y - leftTopTransformed.y);
  }

  /**
   * Transforms point from data XY coordinates to screen XY coordinates.
   * @param {NumericPoint} value - Point in data coordinates.
   * @param {DataRect} visible - Visible data rectangle.
   * @param {DataRect} screenSize - Screen size.
   * @returns {NumericPoint}
   */
  public static dataToScreenXY(value: NumericPoint, visible: DataRect, screenSize: DataRect): NumericPoint {
    const x = value.x;
    const y = value.y;

    const newX = CoordinateTransform.dataToScreenX(x, visible.getHorizontalRange(), screenSize.width);
    const newY = CoordinateTransform.dataToScreenY(y, visible.getVerticalRange(), screenSize.height);

    return new NumericPoint(newX, newY);
  }

  /**
   * Transforms point in data XY coordinates to XY coordinates in specified screen region.
   * @param {NumericPoint} value - Point in data coordinates.
   * @param {DataRect} visible - Visible data rectangle.
   * @param {DataRect} screenRegion - Screen region.
   * @returns {NumericPoint}
   */
  public static dataToScreenRegionXY(value: NumericPoint, visible: DataRect, screenRegion: DataRect): NumericPoint {
    const x = value.x;
    const y = value.y;

    const leftTop = screenRegion.getMinXMinY();

    const newX = leftTop.x + CoordinateTransform.dataToScreenX(x, visible.getHorizontalRange(), screenRegion.getHorizontalRange().getLength());
    const newY = leftTop.y + CoordinateTransform.dataToScreenY(y, visible.getVerticalRange(), screenRegion.getVerticalRange().getLength());

    return new NumericPoint(newX, newY);
  }

  /**
   * Transforms point in data XY coordinates to XY coordinates in specified screen region without inverting y coordinate..
   * @param {NumericPoint} value - Point in data coordinates.
   * @param {DataRect} visible - Visible data rectangle.
   * @param {DataRect} screenRegion - Screen region.
   * @returns {NumericPoint}
   */
  public static dataToScreenRegionXYwithoutYinvert = function (value: NumericPoint, visible: DataRect, screenRegion: DataRect): NumericPoint {
    let res = CoordinateTransform.dataToScreenRegionXY(value, visible, screenRegion);
    res.y = screenRegion.getVerticalRange().getLength() - res.y;
    return res;
  }
}
