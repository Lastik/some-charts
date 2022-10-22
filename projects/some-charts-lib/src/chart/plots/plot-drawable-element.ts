import Konva from "konva";
import {DataTransformation, NumericDataRect, NumericPoint} from "../../geometry";

export class PlotDrawableElement {
  public readonly dataPoint: NumericPoint;
  public readonly konvaDrawable: Konva.Group | Konva.Shape;

  constructor(dataPoint: NumericPoint, konvaDrawable: Konva.Group | Konva.Shape) {
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

  protected static scaleKonvaRect(konvaRect: Konva.Rect, dataTransformation: DataTransformation, visible: NumericDataRect, screen: NumericDataRect): void {
    let konvaRectSize = konvaRect.getSize();
    let newSize = dataTransformation.dataToScreenRegionXY(new NumericPoint(konvaRectSize.width, konvaRectSize.height), visible, screen);
    konvaRect.setSize(newSize);
  }

  destroy() {
    this.konvaDrawable.destroy();
  }
}
