import Konva from "konva";
import {FontInUnits, NumericPoint, PlotOptions, PlotOptionsClass} from "../index";
import {ChartRenderableItem} from "../chart";
import {DataRect, DataTransformation} from "../index";
import {DataSet, DimensionValue} from "../data";
import * as Color from "color";
import {Palette} from "./metric";
import {Transition} from "../transition";
import {MetricDependantValue} from "./metric";
import {FontHelper} from "../../services";

export abstract class Plot<
  PlotOptionsType extends PlotOptions,
  PlotOptionsClassType extends PlotOptionsClass,
  TItemType,
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined> extends ChartRenderableItem {

  private readonly layerName: string;
  private plotShape: Konva.Shape;

  protected visible: DataRect | undefined;
  protected screen: DataRect | undefined;

  protected readonly dataSet: DataSet<TItemType, XDimensionType, YDimensionType>;
  protected readonly  dataTransformation: DataTransformation;
  protected plotOptions: PlotOptionsClassType;

  private screenPoints1DMap: Map<string, Array<NumericPoint>> = new Map<string, Array<NumericPoint>>();

  protected static readonly errors = {
    doesntSupport2DData: "This plot doesn't support 2D Data"
  }

  protected constructor(
    dataSet: DataSet<TItemType, XDimensionType, YDimensionType>,
    dataTransformation: DataTransformation,
    plotOptions: PlotOptionsType) {
    super();

    this.dataSet = dataSet;
    this.dataTransformation = dataTransformation;
    this.plotOptions = PlotOptionsClass.apply(plotOptions) as PlotOptionsClassType;

    this.layerName = `plot-layer-${this.id}`;
    this.plotShape = new Konva.Shape({
      sceneFunc: this.drawFunc
    });
  }

  private drawFunc(context: Konva.Context, shape: Konva.Shape): void {
    let screen = this.screen;
    if (screen) {
      let screenLocation = screen.getMinXMinY();
      let screenSize = screen.getSize();

      context.save();
      context.beginPath();
      context.rect(screenLocation.x + 0.5, screenLocation.y + 0.5, screenSize.width - 0.5, screenSize.height - 0.5);
      context.clip();

      let xDimension = this.dataSet.dimensionXValues;
      let yDimension = this.dataSet.dimensionYValues;

      let is2D = this.dataSet.is2D;

      if (is2D) {
        this.draw2DData(context, shape, xDimension, yDimension!);
      } else {
        this.draw1DData(context, shape, xDimension);
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
                                xDimension: readonly DimensionValue<XDimensionType>[]): void;

  protected abstract draw2DData(context: Konva.Context, shape: Konva.Shape,
                                xDimension: readonly DimensionValue<XDimensionType>[],
                                yDimension: readonly DimensionValue<Exclude<YDimensionType, undefined>>[]): void;

  protected getColor(color: Color | Palette,
                     xDimVal: DimensionValue<XDimensionType>,
                     yDimVal: DimensionValue<Exclude<YDimensionType, undefined>> | undefined = undefined): Color | undefined {
    return color instanceof Color ?
      color :
      (() => {
        let metricValue = this.dataSet.getMetricValueForDimensions(color.metricName, xDimVal, yDimVal);
        return metricValue ?
          new Transition<Color>(color.range).apply(this.dataSet.getMetricRange(color.metricName), metricValue) :
          undefined;
      })();
  }

  protected getDependantNumericValueForMetricValue(dependant: MetricDependantValue<number>,
                                                   xDimVal: DimensionValue<XDimensionType>,
                                                   YDimVal: DimensionValue<Exclude<YDimensionType, undefined>> | undefined): number | undefined {

    let metricValue = this.dataSet.getMetricValueForDimensions(dependant.metricName, xDimVal, YDimVal);

    return metricValue ?
      new Transition<number>(dependant.range).apply(this.dataSet.getMetricRange(dependant.metricName), metricValue) :
      undefined;
  }

  protected getScreenPoints1D(metricName: string): Array<NumericPoint> | undefined {

    if (!this.screenPoints1DMap.has(metricName) && this.visible && this.screen) {
      let dimensionXValues = this.dataSet.dimensionXValues;

      if (this.dataSet.is1D) {
        let metricValues = this.dataSet.getMetricValues(metricName) as number[];
        let transformedPoints = dimensionXValues.map((dimXVal, index) => {
          return this.dataTransformation.dataToScreenRegionXY(
            new NumericPoint(dimXVal.toNumericValue(), metricValues[index]),
            this.visible!, this.screen!);
        });
        this.screenPoints1DMap.set(metricName, transformedPoints);
      } else throw new Error("DataSet is not 1-Dimensional!");
    }
    return this.screenPoints1DMap.get(metricName);
  }

  protected setContextFont(context: Konva.Context, font: FontInUnits){
    context.setAttr('font', FontHelper.fontToString(font));
  }

  /**
   * Calculates bounding rectangle of this plot.
   * */
  getBoundingRectangle(): DataRect | undefined {
    return this.dataSet.getBoundingRectangle(this.plotOptions.metricsOptions.map(o => o.name));
  }
}

