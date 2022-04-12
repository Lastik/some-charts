import {Range} from './Range';
import {DataRect} from './DataRect';
import {Point} from './Point';

export class CoordinateTransform {

  /**
   * Transforms value from data X coordinate to screen X coordinate.
   * @param {number} value - Data point X coordinate.
   * @param {Range} visible - Visible data range.
   * @param {number} screenWidth - Screen width.
   * @returns {number}
   */
  public static dataToScreenX(value: number, visible: Range, screenWidth: number) {
    return CoordinateTransform.dataToScreenDim(value, visible, screenWidth);
  }

  /**
   * Transforms value from data Y coordinate to screen Y coordinate.
   * @param {number} value - Data point Y coordinate.
   * @param {Range} visible - Visible data range.
   * @param {number} screenHeight - Screen height.
   * @returns {number}
   */
  public static dataToScreenY(value: number, visible: Range, screenHeight: number) {
    return screenHeight - CoordinateTransform.dataToScreenDim(value, visible, screenHeight);
  }

  private static dataToScreenDim(value: number, visible: Range, screenDim: number) {
    return (value - visible.min) * screenDim / (visible.max - visible.min);
  }

  /**
   * Transforms value from screen X coordinate to data X coordinate.
   * @param {number} value - Point on screen X coordinate.
   * @param {Range} visible - Visible data range
   * @param {number} screenWidth - Screen width.
   * @returns {number}
   */
  public static screenToDataX(value: number, visible: Range, screenWidth: number) {
    return value * (visible.max - visible.min) / screenWidth + visible.min;
  }

  /**
   * Transforms value from screen Y coordinate to data Y coordinate.
   * @param {number} value - Point on screen Y coordinate.
   * @param {Range} visible - Visible data range
   * @param {number} screenHeight - Screen height.
   * @returns {number}
   */
  public static screenToDataY(value: number, visible: Range, screenHeight: number) {
    return (screenHeight - value) * (visible.max - visible.min) / screenHeight + visible.min;
  }

  /**
   * Transforms point from XY coordinates in specified screen region to data XY coordinate.
   * @param {Point} value - Point in specified screen region coords.
   * @param {DataRect} visible - Visible data rectangle.
   * @param {DataRect} screenRegion - Screen region.
   * @returns {Point}
   */
  public static screenRegionToDataXY(value: Point, visible: DataRect, screenRegion: DataRect) {
    const x = value.x;
    const y = value.y;

    const leftTop = screenRegion.getMinXMinY();

    const newX = CoordinateTransform.screenToDataX(x - leftTop.x, visible.getHorizontalRange(), screenRegion.getHorizontalRange().getLength());
    const newY = CoordinateTransform.screenToDataY(y - leftTop.y, visible.getVerticalRange(), screenRegion.getVerticalRange().getLength());

    return new Point(newX, newY);
  }


  /**
   * Transforms rectangle from XY coordinates in specified screen region to data coordinates.
   * @param {Point} rect - DataRect in specified screen region coords.
   * @param {DataRect} visible - Visible data rectangle.
   * @param {DataRect} screenRegion - Screen region.
   * @returns {DataRect}
   */
  public static screenRegionToDataForRect(rect: DataRect, visible: DataRect, screenRegion: DataRect) {
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
   * @param {Point} value - Point in data coordinates.
   * @param {DataRect} visible - Visible data rectangle.
   * @param {DataRect} screenSize - Screen size.
   * @returns {DataRect}
   */
  public static dataToScreenXY(value: Point, visible: DataRect, screenSize: DataRect) {
    const x = value.x;
    const y = value.y;

    const newX = CoordinateTransform.dataToScreenX(x, visible.getHorizontalRange(), screenSize.width);
    const newY = CoordinateTransform.dataToScreenY(y, visible.getVerticalRange(), screenSize.height);

    return new Point(newX, newY);
  }

  /**
   * Transforms point in data XY coordinates to XY coordinates in specified screen region.
   * @param {Point} value - Point in data coordinates.
   * @param {DataRect} visible - Visible data rectangle.
   * @param {DataRect} screenRegion - Screen region.
   * @returns {Point}
   */
  public static dataToScreenRegionXY(value: Point, visible: DataRect, screenRegion: DataRect) {
    const x = value.x;
    const y = value.y;

    const leftTop = screenRegion.getMinXMinY();

    const newX = leftTop.x + CoordinateTransform.dataToScreenX(x, visible.getHorizontalRange(), screenRegion.getHorizontalRange().getLength());
    const newY = leftTop.y + CoordinateTransform.dataToScreenY(y, visible.getVerticalRange(), screenRegion.getVerticalRange().getLength());

    return new Point(newX, newY);
  }

  /**
   * Transforms point in data XY coordinates to XY coordinates in specified screen region without inverting y coordinate..
   * @param {Point} value - Point in data coordinates.
   * @param {DataRect} visible - Visible data rectangle.
   * @param {DataRect} screenRegion - Screen region.
   * @returns {Point}
   */
  public static dataToScreenRegionXYwithoutYinvert = function (value: Point, visible: DataRect, screenRegion: DataRect) {
    let res = CoordinateTransform.dataToScreenRegionXY(value, visible, screenRegion);
    res.y = screenRegion.getVerticalRange().getLength() - res.y;
    return res;
  }
}
