import Konva from "konva";
import {PlotOptions, PlotOptionsClass, PlotOptionsClassFactory} from "../../options";
import {ChartRenderableItem} from "../chart-renderable-item";
import {DataRect, DataTransformation, Margin, NumericDataRect, NumericPoint} from "../../geometry";
import {
  DataSet,
  DataSetChange,
  DataSetChangedEvent,
  DataSetEventType,
  DimensionValue
} from "../../data";
import * as Color from "color";
import {MetricDependantValue, Palette} from "./metric";
import {Transition} from "../../transition";
import {IDisposable} from "../../i-disposable";

import {ACEventTarget, EventBase, EventListener} from "../../events";
import {PlotDrawableElement} from "./elementwise";
import {AnimationEventType} from "./event";

export abstract class Plot<
  PlotOptionsType extends PlotOptions,
  PlotOptionsClassType extends PlotOptionsClass,
  TItemType,
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined> extends ChartRenderableItem<Konva.Group>
  implements EventListener<DataSetEventType | AnimationEventType>, IDisposable {

  protected visible: NumericDataRect | undefined;
  protected screen: NumericDataRect | undefined;

  protected dataTransformation: DataTransformation;
  protected plotOptions: PlotOptionsClassType;

  private metricPoints1DMap!: Map<string, Array<NumericPoint | Array<NumericPoint>>>;

  public readonly eventTarget: ACEventTarget<AnimationEventType>;

  protected static readonly errors = {
    doesntSupport2DData: "This plot doesn't support 2D Data"
  }

  protected layerId: string;

  protected shapesGroup: Konva.Group;

  protected constructor(
    protected readonly dataSet: DataSet<TItemType, XDimensionType, YDimensionType>,
    dataTransformation: DataTransformation,
    plotOptions: PlotOptionsType) {
    super();

    this.dataTransformation = dataTransformation;
    this.plotOptions = this.buildPlotOptionsClass(plotOptions);
    this.init(this.plotOptions);

    this.dataSet.eventTarget.addListener(DataSetEventType.Changed, this);

    this.layerId = `plot-layer-${this.id}`;

    this.eventTarget = new ACEventTarget<AnimationEventType>();

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

    this.updateFromDataSet(DataSetChange.fromDataSet(this.dataSet));
  }


  protected buildPlotOptionsClass(plotOptions: PlotOptionsType): PlotOptionsClassType {
    return PlotOptionsClassFactory.buildPlotOptionsClass(plotOptions) as PlotOptionsClassType;
  }

  protected init(plotOptions: PlotOptionsClassType) {
    this.metricPoints1DMap = new Map<string, Array<NumericPoint>>();
  }

  eventCallback(event: EventBase<DataSetEventType | AnimationEventType>, options?: any): void {
    if (event.type === DataSetEventType.Changed) {
      let changedEvent = event as DataSetChangedEvent<XDimensionType, YDimensionType>;
      this.updateFromDataSet(changedEvent.change);
    } else if (event.type === AnimationEventType.Tick) {
      this.eventTarget.fireEvent(event as EventBase<AnimationEventType>);
    }
  }

  protected updateFromDataSet(dataSetChange: DataSetChange<XDimensionType, YDimensionType>) {

    this.initOnDataSetUpdate();

    this.rebuildShapesFromDataSet(dataSetChange);

    this.clearPreCalculatedDataSetRelatedData();

    if (this.visible && this.screen) {
      this.updateVisibleAndScreen(this.visible, this.screen);
    }
  }

  protected initOnDataSetUpdate() { }

  /**
   * Sets visible and screen rectangle of plot
   * @param {DataRect} visible - Visible rectangle of plot.
   * @param {DataRect} screen - Screen rectangle of plot.
   */
  updateVisibleAndScreen(visible: NumericDataRect, screen: NumericDataRect) {
    this.visible = visible;
    this.screen = screen;
    if (this.visible && this.screen) {
      this.updateShapesVisibleAndScreen(this.dataTransformation, this.visible, this.screen);
    }
  }

  protected abstract rebuildShapesFromDataSet(dataSetChange: DataSetChange<XDimensionType, YDimensionType>): void;

  protected abstract updateShapesVisibleAndScreen(dataTransformation: DataTransformation, visible: NumericDataRect, screen: NumericDataRect): void;

  protected clearPreCalculatedDataSetRelatedData() {
    this.metricPoints1DMap.clear();
  }

  protected getColor(color: Color | Palette,
                     xDimVal: DimensionValue<XDimensionType>,
                     yDimVal: DimensionValue<Exclude<YDimensionType, undefined>> | undefined = undefined): Color {
    return color instanceof Color ?
      color :
      (() => {
        if(this.dataSet.isSingleMetricValue(color.metricId)) {
          let metricValue = this.dataSet.getMetricValueForDimensions(color.metricId, xDimVal, yDimVal) as number;
          return new Transition<Color>(color.range).apply(this.dataSet.getMetricRange(color.metricId), metricValue)
        }
        else throw new Error('Color transition is only supported for single value metric');
      })();
  }

  protected getDependantNumericValueForMetricValue(dependant: MetricDependantValue<number>,
                                                   xDimVal: DimensionValue<XDimensionType>,
                                                   YDimVal: DimensionValue<Exclude<YDimensionType, undefined>> | undefined): number | undefined {

    if(this.dataSet.isSingleMetricValue(dependant.metricId)) {
      let metricValue = this.dataSet.getMetricValueForDimensions(dependant.metricId, xDimVal, YDimVal) as number;

      return metricValue ?
        new Transition<number>(dependant.range).apply(this.dataSet.getMetricRange(dependant.metricId), metricValue) :
        undefined;
    }
    else throw new Error('Value transition is only supported for single value metric');
  }

  protected getMetricPoints1D(metricId: string): Array<NumericPoint | Array<NumericPoint>> | undefined {
    if (!this.metricPoints1DMap.has(metricId)) {
      let dimensionXValues = this.dataSet.dimensionXValues;

      if (this.dataSet.is1D) {
        let metricValues = this.dataSet.getMetricValues(metricId) as number[] | number[][];
        let points = dimensionXValues.map((dimXVal, index) => {

          let metricValuesForDimVal = metricValues[index];

          if (Array.isArray(metricValuesForDimVal)) {
            return (metricValuesForDimVal as number[]).map(metricValue => new NumericPoint(dimXVal.toNumericValue(), metricValue));
          } else return new NumericPoint(dimXVal.toNumericValue(), metricValuesForDimVal as number);
        });
        this.metricPoints1DMap.set(metricId, points);
      } else throw new Error("DataSet is not 1-Dimensional!");
    }
    return this.metricPoints1DMap.get(metricId);
  }

  protected getMetricPoint1D(metricId: string, xDimension: DimensionValue<XDimensionType>): NumericPoint | Array<NumericPoint> | undefined {
    let metricPoints1D = this.getMetricPoints1D(metricId);
    return metricPoints1D ? metricPoints1D[xDimension.index] : undefined;
  }

  protected getSingleMetricPoints1D(metricId: string): Array<NumericPoint > | undefined {
    if(this.dataSet.isSingleMetricValue(metricId)){
      return this.getMetricPoints1D(metricId) as Array<NumericPoint > | undefined;
    }
    else throw new Error(`DataSet metric ${metricId} is not single!`);
  }

  protected getArrayMetricPoints1D(metricId: string): Array<Array<NumericPoint >> | undefined {
    if(this.dataSet.isArrayMetricValue(metricId)){
      return this.getMetricPoints1D(metricId) as Array<Array<NumericPoint >> | undefined;
    }
    else throw new Error(`DataSet metric ${metricId} is not array!`);
  }

  protected getSingleMetricPoint1D(metricId: string, xDimension: DimensionValue<XDimensionType>): NumericPoint | undefined {
    if(this.dataSet.isSingleMetricValue(metricId)){
      return this.getMetricPoint1D(metricId, xDimension) as NumericPoint | undefined;
    }
    else throw new Error(`DataSet metric ${metricId} is not single!`);
  }

  /**
   * Calculates bounding rectangle of this plot.
   * */
  abstract getBoundingRectangle(): NumericDataRect | undefined;

  getFitToViewMargin(): Margin {
    return new Margin(0, 0, 0, 0);
  }

  dispose(): void {
    this.dataSet.eventTarget.removeListener(DataSetEventType.Changed, this);
    this.eventTarget.dispose();
  }
}
