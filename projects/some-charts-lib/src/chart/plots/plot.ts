import Konva from "konva";
import {PlotOptions, PlotOptionsClass, PlotOptionsClassFactory} from "../../options";
import {FontInUnits} from "../../font"
import {ChartRenderableItem} from "../chart-renderable-item";
import {DataRect, DataTransformation, NumericDataRect, NumericPoint} from "../../geometry";
import {DataSet, DataSetChange, DataSetChangedEvent, DataSetEventType, DimensionValue} from "../../data";
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
  YDimensionType extends number | string | Date | undefined = undefined> extends ChartRenderableItem<Konva.Group>
  implements EventListener<DataSetEventType>, IDisposable{

  protected plotElements: PlotDrawableElement[];

  protected visible: NumericDataRect | undefined;
  protected screen: NumericDataRect | undefined;

  protected readonly dataSet: DataSet<TItemType, XDimensionType, YDimensionType>;
  protected readonly dataTransformation: DataTransformation;
  protected plotOptions: PlotOptionsClassType;

  private metricPoints1DMap: Map<string, Array<NumericPoint>> = new Map<string, Array<NumericPoint>>();

  protected static readonly errors = {
    doesntSupport2DData: "This plot doesn't support 2D Data"
  }

  protected layerId: string;

  protected shapesGroup: Konva.Group;
  protected konvaDrawables: Konva.Group[];

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
      },
      listening: false
    });

    this.konvaDrawables = [this.shapesGroup];

    this.plotElements = [];

    this.updatePlotFromDataSet(DataSetChange.fromDataSet(this.dataSet));
  }

  eventCallback(event: EventBase<DataSetEventType>, options?: any): void {
    if (event.type === DataSetEventType.Changed) {
      let changedEvent = event as DataSetChangedEvent<XDimensionType, YDimensionType>;
      this.updatePlotFromDataSet(changedEvent.change);
    }
  }

  private updatePlotFromDataSet(dataSetChange: DataSetChange<XDimensionType, YDimensionType>){
    for(let plotElt of this.plotElements){
      plotElt.destroy();
    }
    this.shapesGroup.removeChildren();
    this.plotElements = this.createPlotElements();
    this.shapesGroup._shouldFireChangeEvents = false;
    this.shapesGroup.add(...this.plotElements.map(el => el.konvaDrawable));
    this.shapesGroup._shouldFireChangeEvents = true;
    if(this.visible && this.screen) {
      this.update(this.visible, this.screen);
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

  /**
   * Sets visible and screen rectangle of plot
   * @param {DataRect} visible - Visible rectangle of plot.
   * @param {DataRect} screen - Screen rectangle of plot.
   */
  update(visible: NumericDataRect, screen: NumericDataRect) {
    this.visible = visible;
    this.screen = screen;
    this.updatePlotElements();
    this.markDirty();
  }

  private updatePlotElements() {
    if(this.visible && this.screen){
      for(let plotElement of this.plotElements){
        plotElement.update(this.dataTransformation, this.visible, this.screen);
      }
    }
  }

  protected abstract create1DPlotElements(xDimension: readonly DimensionValue<XDimensionType>[]): Array<PlotDrawableElement>;

  protected abstract create2DPlotElements(xDimension: readonly DimensionValue<XDimensionType>[],
                                          yDimension: readonly DimensionValue<Exclude<YDimensionType, undefined>>[]): Array<PlotDrawableElement>;

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
  getBoundingRectangle(): NumericDataRect | undefined {
    return this.dataSet.getBoundingRectangle(this.plotOptions.metricsOptions.map(o => o.name));
  }

  dispose(): void {
    this.dataSet.eventTarget.removeListener(DataSetEventType.Changed, this);
  }
}

