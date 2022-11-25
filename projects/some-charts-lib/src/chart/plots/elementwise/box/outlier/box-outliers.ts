import Konva from "konva";
import * as Color from "color";
import {PlotDrawableElement} from "../../plot-drawable-element";
import {DataTransformation, NumericDataRect, NumericPoint} from "../../../../../geometry";
import {AnimatedProperty} from "../../../animated-property";
import {zip} from "lodash-es";
import {PercentileHelper} from "../../../../../services";

export class BoxOutliers extends PlotDrawableElement {
  private outliersShapes: Konva.Shape[];

  private readonly _size: number;
  private readonly _color: Color;

  public get size() {
    return this._size;
  }

  public get color() {
    return this._color;
  }

  private outliersRelativePositions!: Array<AnimatedProperty<NumericPoint>>;

  override get animatedProperties(): Array<AnimatedProperty<any>> {
    return [...super.animatedProperties, ...this.outliersRelativePositions];
  };

  constructor(metricId: string, dataPoints: NumericPoint[], color: Color, size: number) {
    let origin = BoxOutliers.getOrigin(dataPoints);
    let root = new Konva.Group();
    super(metricId, origin, root);
    this.outliersRelativePositions = dataPoints.map(dp => new AnimatedProperty<NumericPoint>(dp.scalarPlus(origin.additiveInvert())));
    this._color = color;
    this._size = size;
    this.outliersShapes = this.outliersRelativePositions.map(pos => BoxOutliers.createMarkerShape(color, size, pos.displayedValue));
    this.outliersShapes.forEach(shape => root.add(shape));
  }

  private static createMarkerShape(markerColor: Color, markerSize: number, relarivePosition: NumericPoint) {
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

  public setDataPoints(dataPoints: Array<NumericPoint>, animate: boolean = false, animationDuration: number = 0) {
    let origin = BoxOutliers.getOrigin(dataPoints);

    if (this.outliersRelativePositions.length === dataPoints.length) {
      this.outliersRelativePositions = dataPoints.map(dp => new AnimatedProperty<NumericPoint>(dp.scalarPlus(origin.additiveInvert())));
      this.outliersShapes.forEach(shape => {
        shape.remove();
      });
      this.outliersShapes = this.outliersRelativePositions.map(pos => BoxOutliers.createMarkerShape(this.color, this.size, pos.displayedValue));
      this.outliersShapes.forEach(shape => (this.rootDrawable as Konva.Group).add(shape));
    } else {
      zip(this.outliersRelativePositions, dataPoints, this.outliersShapes)
        .map(([relativePosition, dataPoint, shape]) => {
          relativePosition?.setValue(dataPoint?.scalarPlus(origin.additiveInvert())!, animate, animationDuration);
          shape!.setAttrs({
            x: relativePosition!.displayedValue.x,
            y: relativePosition!.displayedValue.y,
          })
        })
    }
  }

  override updateShapesForAnimationFrame(dataPoint: NumericPoint, dataTransformation: DataTransformation, visible: NumericDataRect, screen: NumericDataRect){
    zip(this.outliersShapes, this.outliersRelativePositions).map(([shape, position]) => {
      let positionOnScreen = dataTransformation.getRelativePointLocationOnScreen(dataPoint, position!.displayedValue, visible, screen);
      shape!.setAttrs({
        x: positionOnScreen.x,
        y: positionOnScreen.y
      })
    });
  }

  private static updateMarkerColor(shape: Konva.Shape, markerColor: Color) {
    let circle = shape as Konva.Circle;
    circle.fill(markerColor.toString());
  }

  private static updateOutliersSize(shape: Konva.Shape, markerSize: number) {
    let circle = shape as Konva.Circle;
    circle.radius(markerSize);
  }

  private static updateIsVisible(shape: Konva.Shape, isVisible: boolean) {
    let circle = shape as Konva.Circle;
    circle.visible(isVisible);
  }

  private static getOrigin(dataPoints: Array<NumericPoint>): NumericPoint {
    if (dataPoints.length === 0) {
      return new NumericPoint(0, 0)
    }
    return dataPoints.sort((l, r) => l.y - r.y)[0];
  }
}
