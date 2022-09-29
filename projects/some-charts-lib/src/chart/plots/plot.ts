import Konva from "konva";
import {PlotOptions, PlotOptionsClass, PlotOptionsClassFactory} from "../../options";
import {FontInUnits} from "../../font"
import {ChartRenderableItem} from "../chart-renderable-item";
import {DataRect, DataTransformation, NumericPoint} from "../../geometry";
import {DataSet, DataSetEventType, DimensionValue} from "../../data";
import * as Color from "color";
import {MetricDependantValue, Palette} from "./metric";
import {Transition} from "../../transition";
import {FontHelper} from "../../services";
import {Chart} from "../chart";
import {IDisposable} from "../../i-disposable";

import {EventBase, EventListener} from "../../events";
import {PlotDrawableElement} from "./plot-drawable-element";

export abstract class Plot<
  PlotOptionsType extends PlotOptions,
  PlotOptionsClassType extends PlotOptionsClass,
  TItemType,
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined> extends ChartRenderableItem
  implements EventListener<DataSetEventType>, IDisposable{

  private readonly layerId: string;
  protected plotElements: PlotDrawableElement[];

  protected visible: DataRect | undefined;
  protected screen: DataRect | undefined;

  protected readonly dataSet: DataSet<TItemType, XDimensionType, YDimensionType>;
  protected readonly dataTransformation: DataTransformation;
  protected plotOptions: PlotOptionsClassType;

  private metricPoints1DMap: Map<string, Array<NumericPoint>> = new Map<string, Array<NumericPoint>>();

  protected static readonly errors = {
    doesntSupport2DData: "This plot doesn't support 2D Data"
  }

  private shapesGroup: Konva.Group;

  protected constructor(
    dataSet: DataSet<TItemType, XDimensionType, YDimensionType>,
    dataTransformation: DataTransformation,
    plotOptions: PlotOptionsType) {
    super();

    this.dataSet = dataSet;
    this.dataTransformation = dataTransformation;
    this.plotOptions = PlotOptionsClassFactory.buildPlotOptionsClass(plotOptions) as PlotOptionsClassType;

    this.dataSet.eventTarget.addListener(DataSetEventType.Changed, this);

    this.layerId = `plot-layer-${this.id}`;

    let self = this;

    this.shapesGroup = new Konva.Group({
      clipFunc: function (context) {
        if (self.visible && self.screen) {
          let screenLocation = self.screen.getMinXMinY();
          let screenSize = self.screen.getSize();
          context.rect(screenLocation.x + 0.5, screenLocation.y + 0.5, screenSize.width - 0.5, screenSize.height - 0.5);
        }
      }
    });

    this.plotElements = [];

    this.initPlotFromDataSet();
  }

  eventCallback(event: EventBase<DataSetEventType>, options?: any): void {
    if (event.type === DataSetEventType.Changed) {
      this.initPlotFromDataSet();
    }
  }

  private initPlotFromDataSet(){
    this.plotElements = this.createPlotElements();
    this.shapesGroup.removeChildren();
    for (let element of this.plotElements) {
      element.shape.cache();
      this.shapesGroup.add(element.shape);
    }
    this.isDirty = true;
  }

  private createPlotElements(): Array<PlotDrawableElement> {
    let xDimension = this.dataSet.dimensionXValues;
    let yDimension = this.dataSet.dimensionYValues;

    let is2D = this.dataSet.is2D;

    if (is2D) {
      return this.create2DPlotElements(xDimension, yDimension!);
    } else {
      return this.create1DPlotElements(xDimension);
    }
  }

  getDependantLayers(): string[] {
    return [this.layerId];
  }

  /**
   * Sets visible rectangle of plot
   * @param {DataRect} visible - Visible rectangle of plot.
   */
  setVisible(visible: DataRect) {
    this.visible = visible;
    this.updatePlotShapes();
    this.markDirty();
  }

  /**
   * Sets screen rectangle of plot
   * @param {DataRect} screen - Screen rectangle of plot.
   */
  setScreen(screen: DataRect) {
    this.screen = screen;
    this.updatePlotShapes();
    this.markDirty();
  }

  private updatePlotShapes() {
    if(this.visible && this.screen){
      for(let plotElement of this.plotElements){
        this.updateDrawableElementShape(plotElement, this.visible, this.screen)
      }
    }
  }

  protected abstract create1DPlotElements(xDimension: readonly DimensionValue<XDimensionType>[]): Array<PlotDrawableElement>;

  protected abstract create2DPlotElements(xDimension: readonly DimensionValue<XDimensionType>[],
                                          yDimension: readonly DimensionValue<Exclude<YDimensionType, undefined>>[]): Array<PlotDrawableElement>;

  protected abstract updateDrawableElementShape(element: PlotDrawableElement, visible: DataRect, screen: DataRect): void;

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

  protected getMetricPoints1D(metricName: string): Array<NumericPoint> | undefined {

    if (!this.metricPoints1DMap.has(metricName) && this.visible && this.screen) {
      let dimensionXValues = this.dataSet.dimensionXValues;

      if (this.dataSet.is1D) {
        let metricValues = this.dataSet.getMetricValues(metricName) as number[];
        let points = dimensionXValues.map((dimXVal, index) => {
          return new NumericPoint(dimXVal.toNumericValue(), metricValues[index])
        });
        this.metricPoints1DMap.set(metricName, points);
      } else throw new Error("DataSet is not 1-Dimensional!");
    }
    return this.metricPoints1DMap.get(metricName);
  }

  protected setContextFont(context: Konva.Context, font: FontInUnits) {
    context.setAttr('font', FontHelper.fontToString(font));
  }

  /**
   * Calculates bounding rectangle of this plot.
   * */
  getBoundingRectangle(): DataRect | undefined {
    return this.dataSet.getBoundingRectangle(this.plotOptions.metricsOptions.map(o => o.name));
  }

  override placeOnChart(chart?: Chart) {
    super.placeOnChart(chart);

    if (chart) {
      let plotLayer = chart!.getLayer(this.layerId);
      plotLayer?.add(this.shapesGroup);
    }
  }

  dispose(): void {
    this.dataSet.eventTarget.removeListener(DataSetEventType.Changed, this);
  }
}

