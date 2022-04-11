import {Range} from './Range';
import {DataRect} from './DataRect';
import {Point} from './Point';

export class CoordinateTransform {

  /**
   * Transforms data X coordinate to screen X coordinate.
   * @param {number} value - Data value.
   * @param {Range} visible - Visible data range.
   * @param {number} screenWidth - Screen width.
   * @returns {number}
   */
  public static dataToScreenX(value: number, visible: Range, screenWidth: number) {
    return CoordinateTransform.dataToScreenDim(value, visible, screenWidth);
  }

  /**
   * Transforms data Y coordinate to screen Y coordinate.
   * @param {number} value - Data value.
   * @param {Range} visible - Visible data range.
   * @param {number} screenHeight - Screen height.
   * @returns {number}
   */
  public static dataToScreenY(value: number, visible: Range, screenHeight: number) {
    return screenHeight - CoordinateTransform.dataToScreenDim(value, visible, screenHeight);
  }

  private static dataToScreenDim(value: number, visible: Range, screenDim: number) {
    return (value - visible.min) * screenDim / (visible.max - visible.getMin());
  }

  /**
   * Transforms screen X coordinate to data X coordinate.
   * @param {number} value - Screen value.
   * @param {Range} visible - Visible data range
   * @param {number} screenWidth - Screen width.
   * @returns {number}
   */
  public static screenToDataX(value: number, visible: Range, screenWidth: number) {
    return value * (visible.getMax() - visible.getMin()) / screenWidth + visible.getMin();
  }

  /**
   * Transforms screen Y coordinate to data Y coordinate.
   * @param {number} value - Screen value.
   * @param {Range} visible - Visible data range
   * @param {number} screenHeight - Screen height.
   * @returns {number}
   */
  public static screenToDataY(value: number, visible: Range, screenHeight: number) {
    return (screenHeight - value) * (visible.max - visible.min) / screenHeight + visible.min;
  }

  public static screenRegionToDataXY(value: number, visible: DataRect, screenRegion: DataRect) {
    /// <summary>Transforms screen XY coordinatse to data XY coordinates.</summary>
    /// <param name="value" type="Point">Screen value point.</param>
    /// <param name="visible" type="DataRect">Visible data rectangle</param>
    /// <param name="screenRegion" type="DataRect">Screen region.</param>
    /// <returns type="Point" />
    var x = value.x;
    var y = value.y;

    var leftTop = screenRegion.getMinXMinY();

    var newX = CoordinateTransform.screenToDataX(x - leftTop.x, visible.getHorizontalRange(), screenRegion.getHorizontalRange().getLength());
    var newY = CoordinateTransform.screenToDataY(y - leftTop.y, visible.getVerticalRange(), screenRegion.getVerticalRange().getLength());

    return new Point(newX, newY);
  }

  CoordinateTransform.screenRegionToDataRect = function (rect, visible, screenRegion) {
    /// <summary>Transforms screen rectangle coordinatse to data rectangle coordinates.</summary>
    /// <param name="rect" type="DataRect">Screen value rectangle.</param>
    /// <param name="visible" type="DataRect">Visible data rectangle</param>
    /// <param name="screenRegion" type="DataRect">Screen region.</param>
    /// <returns type="DataRect" />

    var leftTop = rect.getMinXMinY();
    var rightBottom = rect.getMaxXMaxY();

    var leftTopTransformed = CoordinateTransform.screenRegionToDataXY(leftTop, visible, screenRegion);
    var rightBottomTransformed = CoordinateTransform.screenRegionToDataXY(rightBottom, visible, screenRegion);

    var transformed = new DataRect(
      leftTopTransformed.x, leftTopTransformed.y,
      rightBottomTransformed.x - leftTopTransformed.x,
      rightBottomTransformed.y - leftTopTransformed.y);

    return transformed;
  }



  CoordinateTransform.dataToScreenXY = function (value, visible, screenSize) {
    /// <summary>Transforms data XY coordinatse to screen XY coordinates.</summary>
    /// <param name="value" type="Point">Data value point.</param>
    /// <param name="visible" type="DataRect">Visible data rectangle</param>
    /// <param name="screenSize" type="Size">Screen size.</param>
    /// <returns type="Point" />
    var x = value.x;
    var y = value.y;

    var newX = CoordinateTransform.dataToScreenX(x, visible.getHorizontalRange(), screenSize.width);
    var newY = CoordinateTransform.dataToScreenY(y, visible.getVerticalRange(), screenSize.height);

    return new Point(newX, newY);
  }

  CoordinateTransform.dataToScreenRegionXY = function (value, visible, screenRegion) {
    /// <summary>Transforms data XY coordinatse to screen XY coordinates.</summary>
    /// <param name="value" type="Point">Data value point.</param>
    /// <param name="visible" type="DataRect">Visible data rectangle</param>
    /// <param name="screenRegion" type="DataRect">Screen rectangle.</param>
    /// <returns type="Point" />
    var x = value.x;
    var y = value.y;

    var leftTop = screenRegion.getMinXMinY();

    var newX = leftTop.x + CoordinateTransform.dataToScreenX(x, visible.getHorizontalRange(), screenRegion.getHorizontalRange().getLength());
    var newY = leftTop.y + CoordinateTransform.dataToScreenY(y, visible.getVerticalRange(), screenRegion.getVerticalRange().getLength());

    return new Point(newX, newY);
  }

  CoordinateTransform.dataToScreenRegionXYwithoutYinvert = function (value, visible, screenRegion) {
    /// <summary>Transforms data XY coordinatse to screen XY coordinates without inverting y coordinate.</summary>
    /// <param name="value" type="Point">Data value point.</param>
    /// <param name="visible" type="DataRect">Visible data rectangle</param>
    /// <param name="screenRegion" type="DataRect">Screen rectangle.</param>
    /// <returns type="Point" />
    var res = CoordinateTransform.dataToScreenRegionXY(value, visible, screenRegion);
    res.y = screenRegion.getVerticalRange().getLength() - res.y;
    return res;
  }



}
