import {CoordinateTransformation} from "./coordinate-transformation";
import {Size} from "../size";
import {Range} from "../range";
import {NumericPoint} from "../point";
import {NumericRange} from "../numeric-range";
import {NumericDataRect} from "../rect";

export class DataTransformation {

  /**
   * Creates new instance of data DataTransformation. This entity transforms data from data coordinates
   * to screen coordinates and reverse.
   * @param {CoordinateTransformation} coordinateTransformation - Additional transformation applied to data coordinates.
   */
  constructor(public coordinateTransformation?: CoordinateTransformation) {
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
   * @param {NumericDataRect} visible - Visible data rectangle.
   * @param {NumericDataRect} screenRegion - Screen region.
   * @returns {NumericPoint}
   */
  public screenRegionToDataXY(value: NumericPoint, visible: NumericDataRect, screenRegion: NumericDataRect): NumericPoint {
    const x = value.x;
    const y = value.y;

    const minXMinY = screenRegion.getMinXMinY();

    const newX = this.screenToDataX(x - minXMinY.x, visible.getHorizontalRange(), screenRegion.getHorizontalRange().getLength());
    const newY = this.screenToDataY(y - minXMinY.y, visible.getVerticalRange(), screenRegion.getVerticalRange().getLength());

    return new NumericPoint(newX, newY);
  }


  /**
   * Transforms rectangle from XY coordinates in specified screen region to data coordinates.
   * @param {NumericPoint} rect - NumericDataRect in specified screen region coords.
   * @param {NumericDataRect} visible - Visible data rectangle.
   * @param {NumericDataRect} screenRegion - Screen region.
   * @returns {NumericDataRect}
   */
  public screenRegionToDataForRect(rect: NumericDataRect, visible: NumericDataRect, screenRegion: NumericDataRect): NumericDataRect {
    const minXminY = rect.getMinXMinY();
    const maxXMaxY = rect.getMaxXMaxY();

    const minXminYTransformed = this.screenRegionToDataXY(minXminY, visible, screenRegion);
    const maxXMaxYTransformed = this.screenRegionToDataXY(maxXMaxY, visible, screenRegion);

    return new NumericDataRect(minXminYTransformed.x, maxXMaxYTransformed.x, maxXMaxYTransformed.y, minXminYTransformed.y);
  }

  /**
   * Transforms point from data XY coordinates to screen XY coordinates.
   * @param {NumericPoint} value - Point in data coordinates.
   * @param {NumericDataRect} visible - Visible data rectangle.
   * @param {Size} screenSize - Screen size.
   * @returns {NumericPoint}
   */
  public dataToScreenXY(value: NumericPoint, visible: NumericDataRect, screenSize: Size): NumericPoint {
    const x = value.x;
    const y = value.y;

    const newX = this.dataToScreenX(x, visible.getHorizontalRange(), screenSize.width);
    const newY = this.dataToScreenY(y, visible.getVerticalRange(), screenSize.height);

    return new NumericPoint(newX, newY);
  }

  /**
   * Transforms point in data XY coordinates to XY coordinates in specified screen region.
   * @param {NumericPoint} value - Point in data coordinates.
   * @param {NumericDataRect} visible - Visible data rectangle.
   * @param {NumericDataRect} screenRegion - Screen region.
   * @returns {NumericPoint}
   */
  public dataToScreenRegionXY(value: NumericPoint, visible: NumericDataRect, screenRegion: NumericDataRect): NumericPoint {
    const x = value.x;
    const y = value.y;

    const minXMinY = screenRegion.getMinXMinY();

    const newX = minXMinY.x + this.dataToScreenX(x, visible.getHorizontalRange(), screenRegion.getHorizontalRange().getLength());
    const newY = minXMinY.y + this.dataToScreenY(y, visible.getVerticalRange(), screenRegion.getVerticalRange().getLength());

    return new NumericPoint(newX, newY);
  }

  /**
   * Transforms point in data XY coordinates to XY coordinates in specified screen region.
   * @param {NumericPoint} y - Point y coordinate in data coordinates.
   * @param {NumericDataRect} visible - Visible data rectangle.
   * @param {NumericDataRect} screenRegion - Screen region.
   * @returns {number}
   */
  public dataToScreenRegionY(y: number, visible: NumericDataRect, screenRegion: NumericDataRect): number {

    const minXMinY = screenRegion.getMinXMinY();

    return minXMinY.y + this.dataToScreenY(y, visible.getVerticalRange(), screenRegion.getVerticalRange().getLength());
  }

  /**
   * Transforms point in data XY coordinates to XY coordinates in specified screen region without inverting y coordinate..
   * @param {NumericPoint} value - Point in data coordinates.
   * @param {NumericDataRect} visible - Visible data rectangle.
   * @param {NumericDataRect} screenRegion - Screen region.
   * @returns {NumericPoint}
   */
  public dataToScreenRegionXYwithoutYinvert(value: NumericPoint, visible: NumericDataRect, screenRegion: NumericDataRect): NumericPoint {
    let res = this.dataToScreenRegionXY(value, visible, screenRegion);
    res.y = screenRegion.getVerticalRange().getLength() - res.y;
    return res;
  }

  /**
   * Transforms rectangle from XY coordinates in data coordinates to specified screen region.
   * @param {NumericPoint} rect - NumericDataRect in data coords.
   * @param {NumericDataRect} visible - Visible data rectangle.
   * @param {NumericDataRect} screenRegion - Screen region.
   * @returns {NumericDataRect}
   */
  public dataToScreenRegionForRect(rect: NumericDataRect, visible: NumericDataRect, screenRegion: NumericDataRect): NumericDataRect {

    const minXminY = rect.getMinXMinY();
    const maxXMaxY = rect.getMaxXMaxY();

    let minXminYTransformed = this.dataToScreenRegionXY(minXminY, visible, screenRegion);
    let maxXMaxYTransformed = this.dataToScreenRegionXY(maxXMaxY, visible, screenRegion);

    return new NumericDataRect(minXminYTransformed.x, maxXMaxYTransformed.x, minXminYTransformed.y, maxXMaxYTransformed.y);
  }


  public getRelativePointLocationOnScreen(origin: NumericPoint, relativeDataPoint: NumericPoint, visible: NumericDataRect, screen: NumericDataRect) {

    let originOnScreen = this.dataToScreenRegionXY(origin, visible, screen);

    return this.dataToScreenRegionXY(relativeDataPoint.scalarPlus(origin), visible, screen)
      .scalarPlus(originOnScreen.additiveInvert())
  }

  public getRelativeYValueLocationOnScreen(origin: NumericPoint, yValue: number, visible: NumericDataRect, screen: NumericDataRect) {

    let originOnScreen = this.dataToScreenRegionXY(origin, visible, screen);

    return this.dataToScreenRegionY(yValue + origin.y, visible, screen) - originOnScreen.y;
  }

  public getRelativeRectLocationOnScreen(origin: NumericPoint, dataRect: NumericDataRect, visible: NumericDataRect, screen: NumericDataRect) {

    let originOnScreen = this.dataToScreenRegionXY(origin, visible, screen);

    return this.dataToScreenRegionForRect(dataRect.addOffset(origin), visible, screen)
      .addOffset(originOnScreen.additiveInvert());
  }
}
