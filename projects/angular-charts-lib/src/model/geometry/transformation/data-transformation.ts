import {CoordinateTransformation} from "./coordinate-transformation";
import {Size} from "../size";
import {Range} from "../range";
import {DataRect} from "../data-rect";
import {NumericPoint} from "../point";
import {NumericRange} from "../numeric-range";

export class DataTransformation {
  public coordinateTransformation?: CoordinateTransformation;

  /**
   * Creates new instance of data DataTransformation. This entity transforms data from data coordinates
   * to screen coordinates and reverse.
   * @param {CoordinateTransformation} coordinateTransformation - Additional transformation applied to data coordinates.
   */
  constructor(coordinateTransformation?: CoordinateTransformation) {
    this.coordinateTransformation = coordinateTransformation;
  }

  /**
   * Transforms value from data X coordinate to screen X coordinate.
   * @param {number} value - Data point X coordinate.
   * @param {Range} visible - Visible data range.
   * @param {number} screenWidth - Screen width.
   * @returns {number}
   */
  public dataToScreenX(value: number, visible: Range<number>, screenWidth: number): number {
    return DataTransformation.dataToScreenDim(
      this.coordinateTransformation?.applyX(value) ?? value, visible, screenWidth);
  }

  /**
   * Transforms value from data Y coordinate to screen Y coordinate.
   * @param {number} value - Data point Y coordinate.
   * @param {Range} visible - Visible data range.
   * @param {number} screenHeight - Screen height.
   * @returns {number}
   */
  public dataToScreenY(value: number, visible: Range<number>, screenHeight: number): number {
    return screenHeight - DataTransformation.dataToScreenDim(
      this.coordinateTransformation?.applyY(value) ?? value, visible, screenHeight);
  }

  private static dataToScreenDim(value: number, visible: Range<number>, screenDim: number): number {
    return (value - visible.min) * screenDim / (visible.max - visible.min);
  }

  /**
   * Transforms value from screen X coordinate to data X coordinate.
   * @param {number} value - Point on screen X coordinate.
   * @param {Range} visible - Visible data range
   * @param {number} screenWidth - Screen width.
   * @returns {number}
   */
  public screenToDataX(value: number, visible: NumericRange, screenWidth: number): number {
    return (this.coordinateTransformation?.unapplyX(value) ?? value) *
      (visible.max - visible.min) / screenWidth + visible.min;
  }

  /**
   * Transforms value from screen Y coordinate to data Y coordinate.
   * @param {number} value - Point on screen Y coordinate.
   * @param {Range} visible - Visible data range
   * @param {number} screenHeight - Screen height.
   * @returns {number}
   */
  public screenToDataY(value: number, visible: NumericRange, screenHeight: number): number {
    return (screenHeight - (this.coordinateTransformation?.unapplyY(value) ?? value)) *
      (visible.max - visible.min) / screenHeight + visible.min;
  }

  /**
   * Transforms point from XY coordinates in specified screen region to data XY coordinate.
   * @param {NumericPoint} value - Point in specified screen region coords.
   * @param {DataRect} visible - Visible data rectangle.
   * @param {DataRect} screenRegion - Screen region.
   * @returns {NumericPoint}
   */
  public screenRegionToDataXY(value: NumericPoint, visible: DataRect, screenRegion: DataRect): NumericPoint {
    const x = value.x;
    const y = value.y;

    const leftTop = screenRegion.getMinXMinY();

    const newX = this.screenToDataX(x - leftTop.x, visible.getHorizontalRange(), screenRegion.getHorizontalRange().getLength());
    const newY = this.screenToDataY(y - leftTop.y, visible.getVerticalRange(), screenRegion.getVerticalRange().getLength());

    return new NumericPoint(newX, newY);
  }


  /**
   * Transforms rectangle from XY coordinates in specified screen region to data coordinates.
   * @param {NumericPoint} rect - DataRect in specified screen region coords.
   * @param {DataRect} visible - Visible data rectangle.
   * @param {DataRect} screenRegion - Screen region.
   * @returns {DataRect}
   */
  public screenRegionToDataForRect(rect: DataRect, visible: DataRect, screenRegion: DataRect): DataRect {
    const leftTop = rect.getMinXMinY();
    const rightBottom = rect.getMaxXMaxY();

    const leftTopTransformed = this.screenRegionToDataXY(leftTop, visible, screenRegion);
    const rightBottomTransformed = this.screenRegionToDataXY(rightBottom, visible, screenRegion);

    return new DataRect(
      leftTopTransformed.x, leftTopTransformed.y,
      rightBottomTransformed.x - leftTopTransformed.x,
      rightBottomTransformed.y - leftTopTransformed.y);
  }

  /**
   * Transforms point from data XY coordinates to screen XY coordinates.
   * @param {NumericPoint} value - Point in data coordinates.
   * @param {DataRect} visible - Visible data rectangle.
   * @param {Size} screenSize - Screen size.
   * @returns {NumericPoint}
   */
  public dataToScreenXY(value: NumericPoint, visible: DataRect, screenSize: Size): NumericPoint {
    const x = value.x;
    const y = value.y;

    const newX = this.dataToScreenX(x, visible.getHorizontalRange(), screenSize.width);
    const newY = this.dataToScreenY(y, visible.getVerticalRange(), screenSize.height);

    return new NumericPoint(newX, newY);
  }

  /**
   * Transforms point in data XY coordinates to XY coordinates in specified screen region.
   * @param {NumericPoint} value - Point in data coordinates.
   * @param {DataRect} visible - Visible data rectangle.
   * @param {DataRect} screenRegion - Screen region.
   * @returns {NumericPoint}
   */
  public dataToScreenRegionXY(value: NumericPoint, visible: DataRect, screenRegion: DataRect): NumericPoint {
    const x = value.x;
    const y = value.y;

    const leftTop = screenRegion.getMinXMinY();

    const newX = leftTop.x + this.dataToScreenX(x, visible.getHorizontalRange(), screenRegion.getHorizontalRange().getLength());
    const newY = leftTop.y + this.dataToScreenY(y, visible.getVerticalRange(), screenRegion.getVerticalRange().getLength());

    return new NumericPoint(newX, newY);
  }

  /**
   * Transforms point in data XY coordinates to XY coordinates in specified screen region without inverting y coordinate..
   * @param {NumericPoint} value - Point in data coordinates.
   * @param {DataRect} visible - Visible data rectangle.
   * @param {DataRect} screenRegion - Screen region.
   * @returns {NumericPoint}
   */
  public dataToScreenRegionXYwithoutYinvert(value: NumericPoint, visible: DataRect, screenRegion: DataRect): NumericPoint {
    let res = this.dataToScreenRegionXY(value, visible, screenRegion);
    res.y = screenRegion.getVerticalRange().getLength() - res.y;
    return res;
  }
}
