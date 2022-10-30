import Konva from "konva";
import {PlotOptions, PlotOptionsClass, PlotOptionsClassFactory} from "../../options";
import {FontInUnits} from "../../font"
import {ChartRenderableItem} from "../chart-renderable-item";
import {DataRect, DataTransformation, NumericDataRect, NumericPoint} from "../../geometry";
import {
  DataSet,
  DataSetChange,
  DataSetChange1D, DataSetChange2D,
  DataSetChangedEvent,
  DataSetEventType,
  DimensionValue
} from "../../data";
import * as Color from "color";
import {MetricDependantValue, Palette} from "./metric";
import {Transition} from "../../transition";
import {FontHelper} from "../../services";
import {IDisposable} from "../../i-disposable";

import {EventBase, EventListener} from "../../events";
import {PlotDrawableElement} from "./plot-drawable-element";
import {pullAt} from "lodash-es";

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

  protected dataTransformation: DataTransformation;
  protected plotOptions: PlotOptionsClassType;

  private metricPoints1DMap: Map<string, Array<NumericPoint>> = new Map<string, Array<NumericPoint>>();

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

    setTimeout(()=> {
      this.updatePlotFromDataSet(DataSetChange.fromDataSet(this.dataSet));
    });
  }

  protected buildPlotOptionsClass(plotOptions: PlotOptionsType): PlotOptionsClassType {
    return PlotOptionsClassFactory.buildPlotOptionsClass(plotOptions) as PlotOptionsClassType;
  }

  protected init(plotOptions: PlotOptionsClassType) { }

  eventCallback(event: EventBase<DataSetEventType>, options?: any): void {
    if (event.type === DataSetEventType.Changed) {
      let changedEvent = event as DataSetChangedEvent<XDimensionType, YDimensionType>;
      this.updatePlotFromDataSet(changedEvent.change);
    }
  }

  private updatePlotFromDataSet(dataSetChange: DataSetChange<XDimensionType, YDimensionType>){
    let updateResult = this.updatePlotElements(dataSetChange);

    for(let plotElt of updateResult.deleted){
      plotElt.destroy();
      plotElt.rootDrawable.remove();
    }

    pullAt(this.plotElements, updateResult.deletedIndexes);

    for(let plotElt of updateResult.added){
      this.shapesGroup.add(plotElt.rootDrawable);
    }

    this.clearPreCalculatedDataSetRelatedData();

    if(this.visible && this.screen) {
      this.update(this.visible, this.screen);
    }
  }

  private updatePlotElements(dataSetChange: DataSetChange<XDimensionType, YDimensionType>): PlotElementsUpdate {
    let is2D = dataSetChange.is2D;

    let deleted: Array<PlotDrawableElement> = [];
    let added: Array<PlotDrawableElement> = [];
    let deletedIndexes: Array<number> = [];

    if (is2D) {

      let dataSetChange2D = dataSetChange as DataSetChange2D<XDimensionType, YDimensionType>;

      for (let i = 0; i < this.plotElements.length; i++) {
        let plotElt = this.plotElements[i];
        if (dataSetChange2D.isDeleted(plotElt.dataPoint.x, plotElt.dataPoint.y)) {
          deleted.push(plotElt);
          deletedIndexes.push(i);
        } else if (dataSetChange2D.isUpdated(plotElt.dataPoint.x, plotElt.dataPoint.y)) {
          let xy = dataSetChange2D.getUpdated(plotElt.dataPoint.x, plotElt.dataPoint.y)!;
          this.update2DPlotElement(plotElt, xy[0], xy[1]);
        }
      }

      for(let tuple of dataSetChange2D.added){
        let plotElt = this.add2DPlotElement(tuple[0], tuple[1]);
        if(plotElt) {
          this.plotElements.push(plotElt);
          added.push(plotElt);
        }
      }
    } else {

      let dataSetChange1D = dataSetChange as DataSetChange1D<XDimensionType>;

      for (let i = 0; i < this.plotElements.length; i++) {
        let plotElt = this.plotElements[i];
        if (dataSetChange1D.isDeleted(plotElt.dataPoint.x)) {
          deleted.push(plotElt);
          deletedIndexes.push(i);
        } else if (dataSetChange1D.isUpdated(plotElt.dataPoint.x)) {
          this.update1DPlotElement(plotElt, dataSetChange1D.getUpdated(plotElt.dataPoint.x)!);
        }
      }

      for(let value of dataSetChange1D.added){
        let plotElt = this.add1DPlotElement(value);
        if(plotElt) {
          this.plotElements.push(plotElt);
          added.push(plotElt);
        }
      }
    }

    return {deleted: deleted, deletedIndexes: deletedIndexes, added: added};
  }

  protected clearPreCalculatedDataSetRelatedData(){
    this.metricPoints1DMap.clear();
  }

  /**
   * Sets visible and screen rectangle of plot
   * @param {DataRect} visible - Visible rectangle of plot.
   * @param {DataRect} screen - Screen rectangle of plot.
   */
  update(visible: NumericDataRect, screen: NumericDataRect) {
    this.visible = visible;
    this.screen = screen;
    if(this.visible && this.screen){
      for(let plotElement of this.plotElements){
        plotElement.update(this.dataTransformation, this.visible, this.screen);
      }
    }
  }

  protected abstract add1DPlotElement(xDimVal: DimensionValue<XDimensionType>): PlotDrawableElement | undefined;

  protected abstract update1DPlotElement(plotElt: PlotDrawableElement,
                                         xDimVal: DimensionValue<XDimensionType>): void;

  protected abstract add2DPlotElement(xDimVal: DimensionValue<XDimensionType>,
                                      yDimVal: DimensionValue<Exclude<YDimensionType, undefined>>): PlotDrawableElement | undefined;

  protected abstract update2DPlotElement(plotElt: PlotDrawableElement,
                                         xDimVal: DimensionValue<XDimensionType>,
                                         yDimVal: DimensionValue<Exclude<YDimensionType, undefined>>): void;

  protected getColor(color: Color | Palette,
                     xDimVal: DimensionValue<XDimensionType>,
                     yDimVal: DimensionValue<Exclude<YDimensionType, undefined>> | undefined = undefined): Color {
    return color instanceof Color ?
      color :
      (() => {
        let metricValue = this.dataSet.getMetricValueForDimensions(color.metricName, xDimVal, yDimVal)!;
        return new Transition<Color>(color.range).apply(this.dataSet.getMetricRange(color.metricName), metricValue)
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

    if (!this.metricPoints1DMap.has(metricName)) {
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

  protected getMetricPoint1D(metricName: string, xDimension: DimensionValue<XDimensionType>): NumericPoint | undefined {
    let metricPoints1D = this.getMetricPoints1D(metricName);
    return metricPoints1D ? metricPoints1D[xDimension.index] : undefined;
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

interface PlotElementsUpdate {
  deleted: Array<PlotDrawableElement>;
  added: Array<PlotDrawableElement>;
  deletedIndexes: Array<number>;
}
