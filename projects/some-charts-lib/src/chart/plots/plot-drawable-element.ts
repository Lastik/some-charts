import Konva from "konva";
import {DataTransformation, NumericDataRect, NumericPoint} from "../../geometry";

export class PlotDrawableElement<DrawableType extends Konva.Group | Konva.Shape = Konva.Group | Konva.Shape> {

  public dataPoint: NumericPoint;

  public readonly konvaDrawable: DrawableType;

  constructor(dataPoint: NumericPoint, konvaDrawable: DrawableType) {
    this.dataPoint = dataPoint;
    this.konvaDrawable = konvaDrawable;
  }

  update(dataTransformation: DataTransformation, visible: NumericDataRect, screen: NumericDataRect): void {
    PlotDrawableElement.updateKonvaDrawableLocation(this.konvaDrawable, this.dataPoint, dataTransformation, visible, screen)
  }

  protected static updateKonvaDrawableLocation(konvaDrawable: Konva.Group | Konva.Shape, dataPoint: NumericPoint, dataTransformation: DataTransformation, visible: NumericDataRect, screen: NumericDataRect): void {
    let screenLocation = dataTransformation.dataToScreenRegionXY(dataPoint, visible, screen);
    konvaDrawable.setPosition(screenLocation);
  }

  destroy() {
    this.konvaDrawable.destroy();
  }
}
