import Konva from "konva";
import {PlotOptions} from "../index";
import {ChartRenderableItem} from "../chart";
import {DataRect, DataTransformation} from "../index";
import {DataSet, DimensionValue} from "../data";
import * as Color from "color";
import {Palette} from "./metric/palette";
import {ColorLerp, Transition} from "../transition";
import {MetricDependantValue} from "./metric/metric-dependant-value";

export abstract class Plot<
  PlotOptionsType extends PlotOptions,
  TItemType,
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined> extends ChartRenderableItem {

  private readonly layerName: string;
  private plotShape: Konva.Shape;

  protected visible: DataRect | undefined;
  protected screen: DataRect | undefined;

  protected readonly dataSet: DataSet<TItemType, XDimensionType, YDimensionType>;
  protected readonly  dataTransformation: DataTransformation;
  protected plotOptions: PlotOptionsType;

  protected constructor(
    dataSet: DataSet<TItemType, XDimensionType, YDimensionType>,
    dataTransformation: DataTransformation,
    plotOptions: PlotOptionsType) {
    super();

    this.dataSet = dataSet;
    this.dataTransformation = dataTransformation;
    this.plotOptions = plotOptions;

    this.layerName = `plot-layer-${this.id}`;
    this.plotShape = new Konva.Shape({
      sceneFunc: this.drawFunc
    });
  }

  private drawFunc(context: Konva.Context, shape: Konva.Shape): void {
    let screen = this.screen;
    if (screen) {
      let screenLocaton = screen.getMinXMinY();
      let screenSize = screen.getSize();

      context.save();
      context.beginPath();
      context.rect(screenLocaton.x + 0.5, screenLocaton.y + 0.5, screenSize.width - 0.5, screenSize.height - 0.5);
      context.clip();

      let xDimension = this.dataSet.dimensionXValues;
      let yDimension = this.dataSet.dimensionYValues;

      let is2D = this.dataSet.is2D;


      if (is2D) {
        this.draw2DData(context, shape, xDimension, yDimension!);
      } else {
        let metricValues = this.dataSet.getMetricValues(this.plotOptions.metricName);
        this.draw1DData(context, shape, xDimension, <number[]>metricValues);
      }

      context.restore();
    }
  }

  getDependantLayers(): string[] {
    return [this.layerName];
  }

  /**
   * Sets visible rectangle of plot
   * @param {DataRect} visible - Visible rectangle of plot.
   */
  setVisible(visible: DataRect) {
    this.visible = visible;
    this.markDirty();
  }

  /**
   * Sets screen rectangle of plot
   * @param {DataRect} screen - Screen rectangle of plot.
   */
  setScreen(screen: DataRect) {
    this.screen = screen;
    this.markDirty();
  }

  protected abstract draw1DData(context: Konva.Context, shape: Konva.Shape,
                                xDimension: readonly DimensionValue<XDimensionType>[],
                                metricValues: number[]): void;

  protected abstract draw2DData(context: Konva.Context, shape: Konva.Shape,
                                xDimension: readonly DimensionValue<XDimensionType>[],
                                yDimension: readonly DimensionValue<Exclude<YDimensionType, undefined>>[]): void;

  protected getColor(color: Color | Palette,
                     xDimVal: DimensionValue<XDimensionType>,
                     YDimVal: DimensionValue<Exclude<YDimensionType, undefined>> | undefined = undefined): Color {
    return color instanceof Color ?
      color :
      new Transition<Color>(color.range).apply(this.dataSet.getMetricRange(color.metricName), this.dataSet.getMetricValueForDimensions(color.metricName, xDimVal, YDimVal));
  }

  protected getDependantNumericValueForMetricValue(dependant: MetricDependantValue<number>,
                                                   xDimVal: DimensionValue<XDimensionType>,
                                                   YDimVal: DimensionValue<Exclude<YDimensionType, undefined>> | undefined): number {
    return new Transition<number>(dependant.range).apply(this.dataSet.getMetricRange(dependant.metricName), this.dataSet.getMetricValueForDimensions(dependant.metricName, xDimVal, YDimVal));
  }
}

