import Konva from "konva";
import * as Color from "color";
import {PlotDrawableElement} from "../../plot-drawable-element";
import {NumericPoint} from "../../../../../geometry";
import {PercentileHelper} from "../../../../../services";

export class BoxOutliers extends PlotDrawableElement {
  private readonly outliersShapes: Konva.Shape[];

  private _size: number;
  private _color: Color;

  public readonly indexInDataSetValue: number | undefined;

  public get size(){
    return this._size;
  }

  public get color(){
    return this._color;
  }

  constructor(metricId: string, dataPoints: NumericPoint[], color: Color, size: number) {
    let origin = dataPoints.sort((l, r)=> l.y - r.y)[0];
    let root = new Konva.Group();
    super(metricId, origin, root);
    this._color = color;
    this._size = size;
    this.outliersShapes = dataPoints.map(dp => BoxOutliers.createMarkerShape(color, size, dp.scalarPlus(origin.additiveInvert())));
    this.outliersShapes.forEach(shape => root.add(shape));
  }

  private static createMarkerShape(markerColor: Color, markerSize: number, relarivePosition: NumericPoint){
    return new Konva.Circle({
      radius: markerSize,
      fill: markerColor.toString(),
      stroke: 'black',
      strokeWidth: 1,
      perfectDrawEnabled: false,
      x: relarivePosition.x,
      y: relarivePosition.y
    });
  }

  public setDataPoints(dataPoints: Array<NumericPoint>, animate: boolean = false, animationDuration: number = 0){
    let percentile25 = PercentileHelper.calculate25Percentile(dataPoints);
    let percentile75 = PercentileHelper.calculate75Percentile(dataPoints);
    let boxCenter = Box.calculateBoxCenter(dataPoints, percentile25, percentile75);
    this.dataPoint.setValue(boxCenter, animate, animationDuration);
    this.relative25Percentile.setValue(PercentileHelper.calculate25Percentile(dataPoints) - boxCenter.y, animate, animationDuration);
    this.relative75Percentile.setValue(PercentileHelper.calculate75Percentile(dataPoints) - boxCenter.y, animate, animationDuration);
    this.relative50Percentile.setValue(PercentileHelper.calculate50Percentile(dataPoints) - boxCenter.y, animate, animationDuration);
    this.relativeMinY.setValue(PercentileHelper.calculateMinY(percentile25, percentile75) - boxCenter.y, animate, animationDuration);
    this.relativeMaxY.setValue(PercentileHelper.calculateMaxY(percentile25, percentile75) - boxCenter.y, animate, animationDuration);
  }

  private static updateMarkerColor(shape: Konva.Shape, markerColor: Color){
    let circle = shape as Konva.Circle;
    circle.fill(markerColor.toString());
  }

  private static updateOutliersSize(shape: Konva.Shape, markerSize: number){
    let circle = shape as Konva.Circle;
    circle.radius(markerSize);
  }

  private static updateIsVisible(shape: Konva.Shape, isVisible: boolean){
    let circle = shape as Konva.Circle;
    circle.visible(isVisible);
  }
}
