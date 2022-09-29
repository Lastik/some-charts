import Konva from "konva";
import {NumericPoint} from "../../geometry";

export class PlotDrawableElement {
  dataPoint: NumericPoint;
  konvaDrawable: Konva.Group | Konva.Shape;

  constructor(dataPoint: NumericPoint, konvaDrawable: Konva.Group | Konva.Shape) {
    this.dataPoint = dataPoint;
    this.konvaDrawable = konvaDrawable;
  }
}
