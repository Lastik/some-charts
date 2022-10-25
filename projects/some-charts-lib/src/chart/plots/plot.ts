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
import {PlotElementsUpdate} from "./plot-elements-update";

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
    this.shapesGroup._shouldFireChangeEvents = false;

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
    let updateResult = this.updatePlotElements(dataSetChange);

    for(let plotElt of updateResult.deleted){
      plotElt.destroy();
      plotElt.konvaDrawable.remove();
    }

    for(let plotElt of updateResult.added){
      this.shapesGroup.add(plotElt.konvaDrawable);
    }

    if(this.visible && this.screen) {
      this.update(this.visible, this.screen);
    }
    this.isDirty = true;
  }

  private updatePlotElements(dataSetChange: DataSetChange<XDimensionType, YDimensionType>): PlotElementsUpdate {
    let is2D = this.dataSet.is2D;

    let deleted: Array<PlotDrawableElement> = [];
    let updated: Array<PlotDrawableElement> = [];
    let added: Array<PlotDrawableElement> = [];

    if (is2D) {

      let deletedX = new Map(dataSetChange.deletedDimensionXValues.map(v => [v.toNumericValue(), v]));
      let deletedY = new Map(dataSetChange.deletedDimensionYValues!.map(v => [v.toNumericValue(), v]));

      let updatedX = new Map(dataSetChange.updatedDimensionXValues.map(v => [v.toNumericValue(), v]));
      let updatedY = new Map(dataSetChange.updatedDimensionYValues!.map(v => [v.toNumericValue(), v]));

      let addedX = new Map(dataSetChange.addedDimensionXValues.map(v => [v.toNumericValue(), v]));
      let addedY = new Map(dataSetChange.addedDimensionYValues!.map(v => [v.toNumericValue(), v]));

      for (let plotElt of this.plotElements) {
        if (deletedX.has(plotElt.dataPoint.x) && deletedY.has(plotElt.dataPoint.y)) {
          deleted.push(plotElt);
        } else if (updatedX.has(plotElt.dataPoint.x) && updatedY.has(plotElt.dataPoint.y)) {
          updated.push(this.update2DPlotElement(plotElt, updatedX.get(plotElt.dataPoint.x)!, updatedY.get(plotElt.dataPoint.y)!));
        } else if (addedX.has(plotElt.dataPoint.x) && addedY.has(plotElt.dataPoint.y)) {
          added.push(this.add2DPlotElement(addedX.get(plotElt.dataPoint.x)!, addedY.get(plotElt.dataPoint.y)!));
        }
      }

    } else {
      let deletedX = new Map(dataSetChange.deletedDimensionXValues.map(v => [v.toNumericValue(), v]));
      let updatedX = new Map(dataSetChange.updatedDimensionXValues.map(v => [v.toNumericValue(), v]));
      let addedX = new Map(dataSetChange.addedDimensionXValues.map(v => [v.toNumericValue(), v]));

      for (let plotElt of this.plotElements) {
        if (deletedX.has(plotElt.dataPoint.x)) {
          deleted.push(plotElt);
        } else if (updatedX.has(plotElt.dataPoint.x)) {
          updated.push(this.update1DPlotElement(plotElt, updatedX.get(plotElt.dataPoint.x)!));
        } else if (addedX.has(plotElt.dataPoint.x)) {
          added.push(this.add1DPlotElement(addedX.get(plotElt.dataPoint.x)!));
        }
      }
    }

    return {deleted: deleted, updated: updated, added: added};
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
    this.markDirty();
  }

  protected abstract update2DPlotElement(plotElt: PlotDrawableElement,
                                         xDimension: DimensionValue<XDimensionType>,
                                         yDimension: DimensionValue<Exclude<YDimensionType, undefined>>): PlotDrawableElement;

  protected abstract add2DPlotElement(xDimension: DimensionValue<XDimensionType>,
                                      yDimension: DimensionValue<Exclude<YDimensionType, undefined>>): PlotDrawableElement;


  protected abstract update1DPlotElement(plotElt: PlotDrawableElement,
                                         xDimension: DimensionValue<XDimensionType>): PlotDrawableElement;

  protected abstract add1DPlotElement(xDimension: DimensionValue<XDimensionType>): PlotDrawableElement;


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

