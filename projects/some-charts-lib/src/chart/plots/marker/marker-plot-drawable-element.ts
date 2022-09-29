import {PlotDrawableElement} from "../plot-drawable-element";
import Konva from "konva";
import {NumericPoint} from "../../../geometry";

export class MarkerPlotDrawableElement extends PlotDrawableElement {

  public readonly markerShape: Konva.Shape;

  constructor(dataPoint: NumericPoint, markerShape: Konva.Shape) {
    super(dataPoint, markerShape);
    this.markerShape = markerShape;
  }
}
