import {PlotDrawableElement} from "../plot-drawable-element";
import Konva from "konva";
import {NumericPoint} from "../../../geometry";
import * as Color from "color";

export class MarkerPlotDrawableElement extends PlotDrawableElement {

  public readonly markerShape: Konva.Shape;

  private _size: number;
  private _color: Color;

  public get size(){
    return this._size;
  }

  public get color(){
    return this._color;
  }

  public set size(value: number){
    this._size = value;
    MarkerPlotDrawableElement.updateMarkerSize(this.markerShape, value)
  }

  public set color(value: Color){
    this._color = value;
    MarkerPlotDrawableElement.updateMarkerColor(this.markerShape, value);
  }

  constructor(dataPoint: NumericPoint, color: Color, size: number) {
    let markerShape = MarkerPlotDrawableElement.createMarkerShape(color, size);
    super(dataPoint, markerShape);
    this.markerShape = markerShape;
    this._color = color;
    this._size = size;
  }

  private static createMarkerShape(markerColor: Color, markerSize: number){
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

  private static updateMarkerColor(shape: Konva.Shape, markerColor: Color){
    let circle = shape as Konva.Circle;
    circle.fill(markerColor.toString());
  }

  private static updateMarkerSize(shape: Konva.Shape, markerSize: number){
    let circle = shape as Konva.Circle;
    circle.radius(markerSize);
  }
}
