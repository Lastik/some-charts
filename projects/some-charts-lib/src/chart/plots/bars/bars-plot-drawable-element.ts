import {PlotDrawableElement} from "../plot-drawable-element";
import Konva from "konva";
import {NumericPoint} from "../../../geometry";

export class MarkerPlotDrawableElement extends PlotDrawableElement{

  constructor(dataPoint: NumericPoint, konvaDrawable: Konva.Group | Konva.Shape) {
    super(dataPoint, konvaDrawable);
  }
}
