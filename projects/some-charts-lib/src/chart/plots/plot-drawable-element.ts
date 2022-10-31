import Konva from "konva";
import {DataTransformation, NumericDataRect, NumericPoint} from "../../geometry";
import {TextMeasureUtils} from "../../services";

export class PlotDrawableElement<DrawableType extends Konva.Group | Konva.Shape = Konva.Group | Konva.Shape> {

  public dataPoint: NumericPoint;

  constructor(dataPoint: NumericPoint, public readonly rootDrawable: DrawableType,
              protected textMeasureUtils: TextMeasureUtils = TextMeasureUtils.Instance) {
    this.dataPoint = dataPoint;
    this.rootDrawable = rootDrawable;
  }

  update(dataTransformation: DataTransformation, visible: NumericDataRect, screen: NumericDataRect): void {
    this.updateRootDrawableLocation(dataTransformation, visible, screen)
  }

  protected updateRootDrawableLocation(dataTransformation: DataTransformation, visible: NumericDataRect, screen: NumericDataRect): void {
    let screenLocation = this.getLocationOnScreen(dataTransformation, visible, screen);
    this.rootDrawable.setPosition(screenLocation);
  }

  protected getLocationOnScreen(dataTransformation: DataTransformation, visible: NumericDataRect, screen: NumericDataRect){
    return dataTransformation.dataToScreenRegionXY(this.dataPoint, visible, screen);
  }

  destroy() {
    this.rootDrawable.destroy();
  }

  getBoundingRectangle(): NumericDataRect {
    return new NumericDataRect(this.dataPoint.x, this.dataPoint.x, this.dataPoint.y, this.dataPoint.y);
  }
}
