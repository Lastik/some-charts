import Konva from "konva";
import {NumericPoint} from "../../geometry";

export interface PlotDrawableElement {
  dataPoint: NumericPoint;
  konvaDrawable: Konva.Group | Konva.Shape;
}
