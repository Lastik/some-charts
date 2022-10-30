import Konva from "konva";
import {DataTransformation, NumericDataRect, NumericPoint} from "../../geometry";

export class PlotDrawableElement<DrawableType extends Konva.Group | Konva.Shape = Konva.Group | Konva.Shape> {

  public dataPoint: NumericPoint;

  constructor(dataPoint: NumericPoint, public readonly rootDrawable: DrawableType) {
    this.dataPoint = dataPoint;
    this.rootDrawable = rootDrawable;
  }

  update(dataTransformation: DataTransformation, visible: NumericDataRect, screen: NumericDataRect): void {
    PlotDrawableElement.updateKonvaDrawableLocation(this.rootDrawable, this.dataPoint, dataTransformation, visible, screen)
  }

  protected static updateKonvaDrawableLocation(konvaDrawable: Konva.Group | Konva.Shape, dataPoint: NumericPoint, dataTransformation: DataTransformation, visible: NumericDataRect, screen: NumericDataRect): void {
    let screenLocation = dataTransformation.dataToScreenRegionXY(dataPoint, visible, screen);
    konvaDrawable.setPosition(screenLocation);
  }

  destroy() {
    this.rootDrawable.destroy();
  }

  getBoundingRectangle(): NumericDataRect {
    return new NumericDataRect(this.dataPoint.x, this.dataPoint.x, this.dataPoint.y, this.dataPoint.y);
  }
}
