import {PlotDrawableElement} from "../plot-drawable-element";
import Konva from "konva";
import {NumericDataRect, DataTransformation, NumericPoint} from "../../../../geometry";
import * as Color from "color";
import {AnimatedProperty} from "../../animated-property";
import {maxBy, minBy, sumBy} from "lodash-es";

export class Box extends PlotDrawableElement<Konva.Group>{

  private readonly boxShape: Konva.Rect;
  private readonly topWhiskerShape: Konva.Shape;
  private readonly bottomWhiskerShape: Konva.Shape;
  private readonly avgLineShape: Konva.Shape;

  private boxWidth: number;
  private whiskersWidth: number
  private lineWidth: number;

  private fill: Color;
  private stroke: Color;

  private readonly relative25Percentile: AnimatedProperty<number>;
  private readonly relative75Percentile: AnimatedProperty<number>;
  private readonly relativeAvg: AnimatedProperty<number>;

  private readonly relativeMinY: AnimatedProperty<number>;
  private readonly relativeMaxY: AnimatedProperty<number>;

  override get animatedProperties(): Array<AnimatedProperty<any>>{
    return [...super.animatedProperties,
      this.relative25Percentile,
      this.relative75Percentile,
      this.relativeAvg,
      this.relativeMinY,
      this.relativeMaxY];
  };

  constructor(metricId: string,
              dataPoints: Array<NumericPoint>,
              fill: Color,
              stroke: Color,
              boxWidth: number,
              whiskersWidth: number,
              lineWidth: number) {

    let root = new Konva.Group();

    let boxCenter = Box.calculateBoxCenter(dataPoints);

    super(metricId, boxCenter, root);

    this.boxWidth = boxWidth;
    this.whiskersWidth = whiskersWidth;
    this.lineWidth = lineWidth;

    this.fill = fill;
    this.stroke = stroke;

    this.relative25Percentile = new AnimatedProperty<number>(Box.calculate25Percentile(dataPoints) - boxCenter.y);
    this.relative75Percentile = new AnimatedProperty<number>(Box.calculate75Percentile(dataPoints) - boxCenter.y);
    this.relativeAvg = new AnimatedProperty<number>(Box.calculateAvg(dataPoints) - boxCenter.y);
    this.relativeMinY = new AnimatedProperty<number>(Box.calculateMinY(dataPoints) - boxCenter.y);
    this.relativeMaxY = new AnimatedProperty<number>(Box.calculateMaxY(dataPoints) - boxCenter.y);

    this.boxShape = new Konva.Rect({
      stroke: stroke.toString(),
      strokeWidth: lineWidth,
      fill: fill.toString(),
      width: boxWidth
    });

    let self = this;

    this.topWhiskerShape = new Konva.Shape({
      relative75Percentile: undefined,
      relativeMaxY: undefined,
      sceneFunc: function (context: Konva.Context, shape: Konva.Shape) {

        context.save();

        context.setAttr('strokeStyle', self.stroke.toString());
        context.setAttr('lineWidth', self.lineWidth);

        context.setAttr('fillStyle', self.fill.toString());
        context.beginPath();
        context.moveTo(0, shape.getAttr('relative75Percentile'));
        context.lineTo(0, shape.getAttr('relativeMaxY'));

        context.moveTo(-self.whiskersWidth / 2, shape.getAttr('relativeMaxY'));
        context.lineTo(self.whiskersWidth / 2, shape.getAttr('relativeMaxY'));

        context.stroke();
        context.restore();
      }
    });

    this.bottomWhiskerShape = new Konva.Shape({
      relative25Percentile: undefined,
      relativeMinY: undefined,
      sceneFunc: function (context: Konva.Context, shape: Konva.Shape) {

        context.save();

        context.setAttr('strokeStyle', self.stroke.toString());
        context.setAttr('lineWidth', self.lineWidth);

        context.setAttr('fillStyle', self.fill.toString());
        context.beginPath();
        context.moveTo(0, shape.getAttr('relative25Percentile'));
        context.lineTo(0, shape.getAttr('relativeMinY'));

        context.moveTo(-self.whiskersWidth / 2, shape.getAttr('relativeMinY'));
        context.lineTo(self.whiskersWidth / 2, shape.getAttr('relativeMinY'));

        context.stroke();
        context.restore();
      }
    });

    this.avgLineShape = new Konva.Shape({
      relativeAvg: undefined,
      sceneFunc: function (context: Konva.Context, shape: Konva.Shape) {

        context.save();

        context.setAttr('strokeStyle', self.stroke.toString());
        context.setAttr('lineWidth', self.lineWidth);

        context.setAttr('fillStyle', self.fill.toString());
        context.beginPath();
        context.moveTo(-self.boxWidth / 2, shape.getAttr('relativeAvg'));
        context.lineTo(self.boxWidth / 2, shape.getAttr('relativeAvg'));

        context.stroke();
        context.restore();
      }
    });

    root.add(this.boxShape);
    root.add(this.bottomWhiskerShape);
    root.add(this.topWhiskerShape);
    root.add(this.avgLineShape);
  }

  private static checkForEmptyDataPoints(dataPoints: Array<NumericPoint>){
    if(dataPoints.length === 0){
      throw new Error('Array of dataPoints shouldn\'t be empty!');
    }
  }

  public setDataPoints(dataPoints: Array<NumericPoint>, animate: boolean = false, animationDuration: number = 0){
    let boxCenter = Box.calculateBoxCenter(dataPoints);
    this.dataPoint.setValue(boxCenter, animate, animationDuration);
    this.relative25Percentile.setValue(Box.calculate25Percentile(dataPoints) - boxCenter.y);
    this.relative75Percentile.setValue(Box.calculate75Percentile(dataPoints) - boxCenter.y);
    this.relativeAvg.setValue(Box.calculateAvg(dataPoints) - boxCenter.y);
    this.relativeMinY.setValue(Box.calculateMinY(dataPoints) - boxCenter.y);
    this.relativeMaxY.setValue(Box.calculateMaxY(dataPoints) - boxCenter.y);
  }

  override updateShapesForAnimationFrame(dataPoint: NumericPoint, dataTransformation: DataTransformation, visible: NumericDataRect, screen: NumericDataRect){
    let boxLocationOnScreen = dataTransformation.dataToScreenRegionXY(dataPoint, visible, screen);

    let relative25Percentile = this.relative25Percentile.displayedValue;
    let relative75Percentile = this.relative75Percentile.displayedValue;
    let relativeAvg = this.relativeAvg.displayedValue;

    let relativeMinY = this.relativeMinY.displayedValue;
    let relativeMaxY = this.relativeMaxY.displayedValue;

    let relative25PercentileOnScreen = dataTransformation.getRelativeYValueLocationOnScreen(boxLocationOnScreen, relative25Percentile, visible, screen);
    let relative75PercentileOnScreen = dataTransformation.getRelativeYValueLocationOnScreen(boxLocationOnScreen, relative75Percentile, visible, screen);

    let relativeAvgOnScreen = dataTransformation.getRelativeYValueLocationOnScreen(boxLocationOnScreen, relativeAvg, visible, screen);
    let relativeMinYOnScreen = dataTransformation.getRelativeYValueLocationOnScreen(boxLocationOnScreen, relativeMinY, visible, screen);
    let relativeMaxYOnScreen = dataTransformation.getRelativeYValueLocationOnScreen(boxLocationOnScreen, relativeMaxY, visible, screen);

    this.boxShape.setAttrs({
      x: - this.boxWidth / 2,
      y: relative25PercentileOnScreen,
      width: this.boxWidth,
      height: relative75PercentileOnScreen - relative25PercentileOnScreen
    });

    this.topWhiskerShape.setAttrs({
      relative75Percentile: relative75PercentileOnScreen,
      relativeMaxY: relativeMaxYOnScreen
    });

    this.bottomWhiskerShape.setAttrs({
      relative25Percentile: relative25PercentileOnScreen,
      relativeMinY: relativeMinYOnScreen
    });

    this.avgLineShape.setAttrs({
      relativeAvg: relativeAvgOnScreen
    });
  }

  override getBoundingRectangle(): NumericDataRect {
    let minY = this.relativeMinY.displayedValue;
    let maxY = this.relativeMaxY.displayedValue;
    let minX = -this.boxWidth / 2;
    let maxX = this.boxWidth / 2;
    return new NumericDataRect(minX, maxX, minY, maxY);
  }

  private static calculateBoxCenter(dataPoints: Array<NumericPoint>){

    Box.checkForEmptyDataPoints(dataPoints);

    let minY = Box.calculateMinY(dataPoints);
    let maxY = Box.calculateMinY(dataPoints);

    let centerY = (maxY - minY) / 2;
    let x = dataPoints[0].x;

    return new NumericPoint(x, centerY)
  }

  private static calculateMinY(dataPoints: Array<NumericPoint>): number {
    Box.checkForEmptyDataPoints(dataPoints);
    return minBy(dataPoints, dp => dp.y)?.y!
  }

  private static calculateMaxY(dataPoints: Array<NumericPoint>): number {
    Box.checkForEmptyDataPoints(dataPoints);
    return maxBy(dataPoints, dp => dp.y)?.y!;
  }

  private static calculate25Percentile(dataPoints: Array<NumericPoint>): number{
    return Box.calculatePercentile(dataPoints, 25);
  }

  private static calculate75Percentile(dataPoints: Array<NumericPoint>): number{
    return Box.calculatePercentile(dataPoints, 75);
  }

  private static calculatePercentile(dataPoints: Array<NumericPoint>, percentilePercent: number): number{
    Box.checkForEmptyDataPoints(dataPoints);
    let dataPointsCount = dataPoints.length;
    let percentileIndex = Math.max(Math.round(percentilePercent / 100 * dataPointsCount) - 1, 0);
    return dataPoints[percentileIndex].y;
  }

  private static calculateAvg(dataPoints: Array<NumericPoint>): number{
    Box.checkForEmptyDataPoints(dataPoints);
    return sumBy(dataPoints, v => v.y) / dataPoints.length;
  }
}
