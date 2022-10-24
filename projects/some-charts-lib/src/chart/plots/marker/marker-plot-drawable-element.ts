import {PlotDrawableElement} from "../plot-drawable-element";
import Konva from "konva";
import {NumericPoint} from "../../../geometry";
import * as Color from "color";

export class MarkerPlotDrawableElement extends PlotDrawableElement {

  public readonly markerShape: Konva.Shape;
  private markerSize: number;

  constructor(dataPoint: NumericPoint, markerColor: Color, markerSize: number) {
    let markerShape = MarkerPlotDrawableElement.createMarkerShape(markerColor, markerSize);
    super(dataPoint, markerShape);
    this.markerShape = markerShape;
    this.markerSize = markerSize;
  }

  private static createMarkerShape( markerColor: Color, markerSize: number){
    let circle = new Konva.Circle({
      radius: markerSize,
      fill: markerColor.toString(),
      stroke: 'black',
      strokeWidth: 1,
      perfectDrawEnabled: false
    });
    circle._shouldFireChangeEvents = false;
    return circle;
  }
}
