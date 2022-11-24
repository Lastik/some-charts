import Konva from "konva";
import * as Color from "color";
import {PlotDrawableElement} from "../../plot-drawable-element";
import {NumericPoint} from "../../../../../geometry";
import {PercentileHelper} from "../../../../../services";
import {AnimatedProperty} from "../../../animated-property";

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

  private outliersRelativePositions!: Array<AnimatedProperty<NumericPoint>>;

  override get animatedProperties(): Array<AnimatedProperty<any>>{
    return [...super.animatedProperties, ...this.outliersRelativePositions];
  };

  constructor(metricId: string, dataPoints: NumericPoint[], color: Color, size: number) {
    let origin = dataPoints.sort((l, r)=> l.y - r.y)[0];
    let root = new Konva.Group();
    super(metricId, origin, root);
    this.outliersRelativePositions = dataPoints.map(dp => new AnimatedProperty<NumericPoint>( dp.scalarPlus(origin.additiveInvert())));
    this._color = color;
    this._size = size;
    this.outliersShapes = this.outliersRelativePositions.map(pos => BoxOutliers.createMarkerShape(color, size, pos.displayedValue));
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
    let origin = dataPoints.sort((l, r)=> l.y - r.y)[0];

    if(this.outliersRelativePositions.length === dataPoints.length){

    }
    else {

    }
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
