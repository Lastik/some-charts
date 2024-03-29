import Konva from "konva";
import {Grid} from "./grid";
import {AnimationEventType, Plot, PlotFactory} from "./plots";
import {DataSet, DataSetChange, DataSetEventType, DimensionType, DimensionValue} from "../data";
import {Renderer} from "../renderer";
import {ChartRenderableItem} from "./chart-renderable-item";
import {KeyboardNavigation, KeyboardNavigationsFactory, MouseNavigation} from "./navigation";
import {
  CoordinateTransformationStatic,
  DataRect,
  DataTransformation, Margin,
  NumericDataRect,
  NumericPoint,
  Point,
  Range,
  Size
} from "../geometry";

import {
  AxisOptions,
  ChartOptions,
  ChartOptionsDefaults, HeaderOptions, LabelOptions,
  NumericAxisOptions,
  PlotOptions,
  PlotOptionsClass,
  PlotOptionsClassFactory, RendererOptionsDefaults
} from "../options";

import {EventBase, EventListener} from "../events";

import {AxisBase, AxisOrientation, AxisTypes, DateAxis, LabeledAxis, NumericAxis} from "./axis";
import {LayerId} from "../layer-id";
import {Legend} from "./legend";
import {IDisposable} from "../i-disposable";
import {Label} from "./label";
import {ResizeSensor} from "css-element-queries";

import * as $ from 'jquery'
import merge from "lodash-es/merge";
import {cloneDeep} from "lodash-es";

export class Chart<TItemType = any,
  XDimensionType extends number | string | Date = number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined>
    implements EventListener<DataSetEventType | AnimationEventType>, IDisposable {

  private isDisposed: boolean = false;

  public static readonly MinZoomLevel: number = 1e-8;

  private readonly container: string | HTMLDivElement;
  private readonly element: HTMLElement | undefined;
  private readonly jqueryElt: JQuery<HTMLElement>;

  private readonly _id: number;

  private _renderer: Renderer;

  private readonly _location: NumericPoint;
  private _size: Size;

  private dataTransformation: DataTransformation;

  private readonly contentItems: ChartRenderableItem[];
  private readonly plots: Plot<PlotOptions, PlotOptionsClass, TItemType, XDimensionType, YDimensionType>[];

  private _visibleRect: DataRect<XDimensionType, YDimensionType extends undefined ? number : Exclude<YDimensionType, undefined>> | undefined;
  private _visibleRectAsNumeric: NumericDataRect;

  private _screenRect: NumericDataRect | undefined;

  private readonly keyboardNavigation: KeyboardNavigation | undefined;
  private readonly mouseNavigation: MouseNavigation | undefined;
  private readonly headerLabel: Label | undefined;

  private dataSet: DataSet<TItemType, XDimensionType, YDimensionType>;

  private legend: Legend | undefined;

  private layersConfigs: Array<Konva.LayerConfig>;

  private resizeSensor: ResizeSensor | undefined;
  private resizeSensorCallback: () => void;

  private isFitToViewModeEnabled: boolean;

  private isAsyncFitToViewRequired: boolean = false;

  public get id(): number{
    return this._id;
  }

  public get location(): NumericPoint{
    return this._location;
  }

  public get size(): Size {
    return this._size;
  }

  public get visibleRect(): DataRect<XDimensionType, YDimensionType extends undefined ? number : Exclude<YDimensionType, undefined>> | undefined {
    return this._visibleRect;
  }

  public get screenRect(): NumericDataRect {
    return this._screenRect ?? new NumericDataRect(0, this.size.width, 0, this.size.height);
  }

  public get visibleRectAsNumeric(): NumericDataRect {
    return this._visibleRectAsNumeric;
  }

  private options: ChartOptions;

  private horizontalAxis?: AxisBase<any, any>;
  private verticalAxis?: AxisBase<any, any>;

  private chartGrid: Grid;

  private static currentChartId: number = 1;

  /**
   * Creates new instance of chart.
   * @param {string} container - Container element.
   * @param {DataSet} dataSet - DataSet with data for this chart.
   * @param {ChartOptions} options - Chart options.
   * @param {DataRect} visibleRect - Currently visible rectangle on chart.
   * @param {PlotFactory} plotFactory - injected factory to create plots based on options.
   * @param {KeyboardNavigationsFactory} keyboardNavigationsFactory - injected factory to create keyboard navigation.
   * */
  constructor(container: string | HTMLDivElement,
              dataSet: DataSet<TItemType, XDimensionType, YDimensionType>,
              options: ChartOptions,
              visibleRect: DataRect<XDimensionType, YDimensionType extends undefined ? number : Exclude<YDimensionType, undefined>> | undefined = undefined,
              private plotFactory: PlotFactory = PlotFactory.Instance,
              private keyboardNavigationsFactory: KeyboardNavigationsFactory = KeyboardNavigationsFactory.Instance ) {

    this.options = ChartOptionsDefaults.extendWith(options);

    this._id = Chart.getNextId();

    this.container = container;

    const containerElt = $(container as any);

    containerElt.addClass('sc-chart-container');

    let rendererOptions = merge(cloneDeep(RendererOptionsDefaults.Instance), this.options!.renderer!);
    containerElt.css('background-color', rendererOptions.backgroundColor!);

    if (this.options.header) {
      this.headerLabel = new Label(container, this.options.header);
    }

    let plotOptionsArr = this.options.plots!.map(po => PlotOptionsClassFactory.buildPlotOptionsClass(po))
      .filter(po => po) as PlotOptionsClass[];

    this.buildLegend(plotOptionsArr);

    this.jqueryElt = $('<div></div').
      addClass('sc-chart').
      attr('id', this._id);

    containerElt.append(this.jqueryElt);

    this.element = this.jqueryElt.length > 0 ? this.jqueryElt[0] : undefined;

    this._location = new NumericPoint(0, 0);
    this._size = new Size(this.jqueryElt.innerWidth() ?? 0, this.jqueryElt.innerHeight() ?? 0);

    this.resizeSensorCallback = () => {
      this.resize();
    };

    this.resizeSensor = this.element ? new ResizeSensor(this.element, this.resizeSensorCallback) : undefined;

    this._renderer = new Renderer(`#${this._id}`, this.size, this.options!.renderer!);

    this.layersConfigs = [];

    this.layersConfigs.push(...Chart.getCommonLayersIds().map(layerId => {
      return {id: layerId, listening: false}
    }));

    this.dataSet = dataSet;

    this._visibleRect = visibleRect;
    this._visibleRectAsNumeric = visibleRect ? this.dimensionalVisibleRectToNumeric(visibleRect) : new NumericDataRect(0, 1, 0, 1)

    this.dataTransformation = new DataTransformation(CoordinateTransformationStatic.buildFromOptions(this.options?.axes!));

    this.contentItems = [];

    this.horizontalAxis = this.createAxis(this.dataTransformation, AxisOrientation.Horizontal, this.options?.axes!.horizontal);
    this.verticalAxis = this.createAxis(this.dataTransformation, AxisOrientation.Vertical, this.options?.axes!.vertical);

    this.chartGrid = new Grid(this.location, this.size, this.options.grid);

    this.plots = [];

    for (let plotOptions of plotOptionsArr) {
      let plot = this.plotFactory?.createPlot<TItemType, XDimensionType, YDimensionType>(dataSet, this.dataTransformation, plotOptions);
      if (plot) {
        this.plots.push(plot);
        plot.eventTarget.addListener(AnimationEventType.Tick, this);

        let plotLayers = plot.getDependantLayers();
        for (let plotLayerId of plotLayers) {
          if (this.layersConfigs.findIndex(config => config.id === plotLayerId) < 0) {
            this.layersConfigs.push({id: plotLayerId});
          }
        }
      }
    }

    Chart.createLayers(this.renderer, this.layersConfigs);

    this.updateLabeledAxesLabels();

    if (this.horizontalAxis) {
      this.horizontalAxis.placeOnChart(this as Chart);
    }

    if (this.verticalAxis) {
      this.verticalAxis.placeOnChart(this as Chart)
    }

    this.chartGrid.placeOnChart(this as Chart)

    for (let plot of this.plots) {
      plot.attach(this._renderer);
      plot.placeOnChart(this as Chart);
    }

    for (let contentItem of this.contentItems) {
      contentItem.attach(this._renderer);
    }

    if (this.options.navigation!.isEnabled === true) {
      this.keyboardNavigation = this.keyboardNavigationsFactory?.create();
      this.mouseNavigation = new MouseNavigation(this.location, this.size);
      this.keyboardNavigation?.placeOnChart(this as Chart);
      this.mouseNavigation?.placeOnChart(this as Chart)
    }

    this.updateNumeric(this.visibleRectAsNumeric);

    this.dataSet.eventTarget.addListener(DataSetEventType.Changed, this);

    this.isFitToViewModeEnabled = false;

    if (!visibleRect || this.options?.navigation?.isFitToViewModeEnabled) {
      setTimeout(() => {
        this.fitToView();

        if (this.options?.navigation?.isFitToViewModeEnabled) {
          this.isFitToViewModeEnabled = true;
        }
      });
    }

    this.onFrameRenderedCycle();
  }

  get renderer(): Renderer{
    return this._renderer;
  }

  getLayer(layerId: string): Konva.Layer | undefined {
    let renderer = this.renderer;
    return renderer ? <Konva.Layer>renderer.getLayer(layerId): undefined;
  }

  public addContentItem(contentItem: ChartRenderableItem){
    this.contentItems.push(contentItem);
  }

  public removeContentItem(contentItem: ChartRenderableItem){
    let indexOfContent = this.contentItems.indexOf(contentItem);
    if(indexOfContent >= 0) {
      this.contentItems.splice(indexOfContent, 1);
    }
  }

  public addPlot(plot: Plot<PlotOptions, PlotOptionsClass, TItemType, XDimensionType, YDimensionType>){
    this.addContentItem(plot);
  }

  /**
   * Updates chart's visible rectangle, using dimension values.
   * @param {DataRect} visibleRect - new visible rectangle for chart
   * @param {boolean} isTriggeredByInputDevice - whether this update is triggered by user input device (Mouse, Keyboard, etc) or not.
   * */
  update(visibleRect: DataRect<XDimensionType, YDimensionType extends undefined ? number : Exclude<YDimensionType, undefined>>, isTriggeredByInputDevice: boolean = false) {
    this._visibleRect = visibleRect;

    let visibleRectAsNumeric = this.dimensionalVisibleRectToNumeric(visibleRect);

    this.updateNumeric(visibleRectAsNumeric, isTriggeredByInputDevice);
  }

  /**
   * Updates chart's visible rectangle, using numeric values.
   * @param {NumericDataRect} visibleRectAsNumeric - new visible rectangle for chart in numeric units
   * @param {boolean} isTriggeredByInputDevice - whether this update is triggered by user input device (Mouse, Keyboard, etc) or not.
   * */
  updateNumeric(visibleRectAsNumeric: NumericDataRect, isTriggeredByInputDevice: boolean = false) {

    if(isTriggeredByInputDevice) {
      this.isFitToViewModeEnabled = false;
      this.isAsyncFitToViewRequired = false;
    }

    this._visibleRectAsNumeric = visibleRectAsNumeric;
    this._visibleRect = this.numericVisibleRectToDimensional(visibleRectAsNumeric);

    let horizontalRange = this._visibleRectAsNumeric.getHorizontalRange();
    let verticalRange = this._visibleRectAsNumeric.getVerticalRange();

    let horizontalAxisHeight = 0;
    if (this.options.axes!.horizontal.axisType != AxisTypes.None) {
      horizontalAxisHeight = this.horizontalAxis!.size.height;
    }

    if(this.verticalAxis) {
      this.verticalAxis.update(this._location, verticalRange, undefined, this._size.height - horizontalAxisHeight);
    }

    let verticalAxisSize = this.verticalAxis?.size;

    if (this.horizontalAxis) {

      let axisRange = this.options.axes?.horizontal.axisType === AxisTypes.DateAxis ?
        new Range<Date>(
          DimensionValue.buildForDateFromPrimitive(horizontalRange.min).value,
          DimensionValue.buildForDateFromPrimitive(horizontalRange.max).value) :
        horizontalRange;

      this.horizontalAxis.update(
        new NumericPoint(this._location.x + (verticalAxisSize?.width ?? 0),
          this._location.y + (verticalAxisSize?.height ?? 0)),
        axisRange,
        this._size.width - (verticalAxisSize?.width ?? 0), undefined);
    }

    let horizontalAxisSize = this.horizontalAxis?.size;

    let gridLocation = new NumericPoint(this._location.x + (verticalAxisSize?.width ?? 0), this._location.y);
    let gridSize = new Size(horizontalAxisSize?.width ?? this.size.width, verticalAxisSize?.height ?? this.size.height);

    let horizontalAxisTicks: Array<number> | undefined = undefined;
    let verticalAxisTicks: Array<number> | undefined = undefined;

    if (this.horizontalAxis) {
      horizontalAxisTicks = this.horizontalAxis.getMajorTicksScreenCoords();
    }

    if (this.verticalAxis) {
      verticalAxisTicks = this.verticalAxis.getMajorTicksScreenCoords();
    }

    this.chartGrid.update(
      gridLocation,
      gridSize);

    this.chartGrid.setLinesCoords(verticalAxisTicks ?? [], horizontalAxisTicks ?? [], );

    if(this.mouseNavigation){
      this.mouseNavigation.update(gridLocation, gridSize);
    }

    this._screenRect = new NumericDataRect(gridLocation.x, gridLocation.x + gridSize.width, gridLocation.y, gridLocation.y + gridSize.height);

    for (let plot of this.plots) {
      plot.updateVisibleAndScreen(
        this._visibleRectAsNumeric,
        this._screenRect
      );
    }
  }

  /**
   * Fits all plots on chart to view them
   * */
  fitToView() {
    this.isFitToViewModeEnabled = true;
    if(this.plots.length) {
      let firstPlot = this.plots[0];
      let chartBoundingRect = firstPlot.getBoundingRectangle();
      let chartFitToViewMargin = firstPlot.getFitToViewMargin();
      if (chartBoundingRect) {
        for (let i = 1; i < this.plots.length; i++) {
          let plot = this.plots[i];
          let plotBoundingRect = plot.getBoundingRectangle();
          if (plotBoundingRect) {
            chartBoundingRect = chartBoundingRect.merge(plotBoundingRect);
            chartFitToViewMargin = chartFitToViewMargin.merge(plot.getFitToViewMargin());
          }
        }

        chartBoundingRect = this.addMarginToBoundingRect(chartBoundingRect, chartFitToViewMargin);

        let coeff = 0.03;

        let horSize = chartBoundingRect.getHorizontalRange().getLength();
        let verSize = chartBoundingRect.getVerticalRange().getLength();

        let offsetX = horSize * coeff;
        let offsetY = verSize * coeff;

        chartBoundingRect = new NumericDataRect(chartBoundingRect.minX - offsetX / 2, chartBoundingRect.maxX + offsetX / 2, chartBoundingRect.minY - offsetY / 2, chartBoundingRect.maxY + offsetY / 2);

        if (this.options.navigation!.fixedTopBound) {
          chartBoundingRect = chartBoundingRect.withHeight((this.options.navigation!.fixedTopBound - chartBoundingRect.minY) * (1 + coeff));
        }
        else if(this.options.navigation!.relativePadding){
          chartBoundingRect = chartBoundingRect.addRelativePadding(this.options.navigation!.relativePadding)
        }
        if (chartBoundingRect.height == 0) {
          chartBoundingRect = chartBoundingRect.withHeight(1);
        }
        if (chartBoundingRect.width == 0) {
          chartBoundingRect = chartBoundingRect.withWidth(0);
        }
        this.updateNumeric(chartBoundingRect);
      }
    }
  }

  private addMarginToBoundingRect(boundingRect: NumericDataRect, margin: Margin): NumericDataRect {
    return this.dataTransformation.screenRegionToDataForRect(this.screenRect.addMargin(margin), boundingRect, this.screenRect);
  }

  private static getNextId(): number{
    return Chart.currentChartId++;
  }

  getPlotSize(): Size {
    //TODO: return chart grid size?
    return this.size;
  }

  private createAxis(dataTransformation: DataTransformation,
                     orientation: AxisOrientation,
                     options: AxisOptions): AxisBase<any, any> | undefined {
    let axisWidth = orientation === AxisOrientation.Vertical ? undefined : this.size.width;
    let axisHeight = orientation === AxisOrientation.Vertical ? this.size.height : undefined;

    let axisLocation = orientation === AxisOrientation.Vertical ? this.location :
      new NumericPoint(this.location.x, this.location.y + this.size.height);

    let axisRange = orientation === AxisOrientation.Vertical ? this._visibleRectAsNumeric.getVerticalRange() : this._visibleRectAsNumeric.getHorizontalRange();

    if (options.axisType == AxisTypes.NumericAxis) {
      return new NumericAxis(axisLocation, orientation, axisRange, dataTransformation, options as NumericAxisOptions, axisWidth, axisHeight);
    } else if (options.axisType === AxisTypes.LabeledAxis) {
      return new LabeledAxis(axisLocation, orientation, axisRange, dataTransformation, options as AxisOptions, axisWidth, axisHeight);
    } else if (options.axisType === AxisTypes.None) {
      return undefined;
    } else if (options.axisType === AxisTypes.DateAxis && orientation === AxisOrientation.Horizontal) {

      let axisDateRange = new Range<Date>(
        DimensionValue.buildForDateFromPrimitive(axisRange.min).value,
        DimensionValue.buildForDateFromPrimitive(axisRange.max).value)

      return new DateAxis(axisLocation, orientation, axisDateRange, dataTransformation, options as AxisOptions, axisWidth, axisHeight);
    } else throw new Error("Specified axis type is not supported");
  }

  private static getCommonLayersIds(){
    return Object.values(LayerId);
  }

  private static createLayers(renderer: Renderer, layersConfigs: Array<Konva.LayerConfig>) {
    renderer.createLayers(layersConfigs);
  }

  eventCallback(event: EventBase<DataSetEventType | AnimationEventType>, options?: any): void {
    if(event.type === DataSetEventType.Changed){
      this.updateLabeledAxesLabels();
      if(this.isFitToViewModeEnabled){
        this.fitToView();
      }
    }
    else if(event.type === AnimationEventType.Tick){
      if(this.isFitToViewModeEnabled) {
        this.isAsyncFitToViewRequired = true;
      }
    }
  }

  protected updateLabeledAxesLabels() {

    const dataSetWithLabeledAxisMustHaveStringDimensionErrorMessage = 'DataSet with labeled axis must have the corresponding dimension of string type!';

    if (this.options.axes!.horizontal.axisType === AxisTypes.LabeledAxis) {
      if (this.dataSet.dimensionXType === DimensionType.String) {
        (this.horizontalAxis as LabeledAxis).updateLabels(this.dataSet.dimensionXValues.map(v => <Point<string>>v.toPoint()));
      } else throw new Error(dataSetWithLabeledAxisMustHaveStringDimensionErrorMessage)
    }
    if (this.options.axes!.vertical.axisType === AxisTypes.LabeledAxis) {
      if (this.dataSet.is2D) {
        if (this.dataSet.dimensionXType === DimensionType.String) {
          (this.verticalAxis as LabeledAxis).updateLabels(this.dataSet.dimensionYValues!.map(v => <Point<string>>v.toPoint()));
        } else throw new Error(dataSetWithLabeledAxisMustHaveStringDimensionErrorMessage)
      } else throw new Error('1D DataSet can\'t be used with horizontal labeled axis!');
    }
  }

  private buildLegend(plotOptionsArr: Array<PlotOptionsClass>) {

    this.legend = new Legend(this.container, this.options.legend);

    this.legend.updateContent(plotOptionsArr.flatMap(po => {
      return po.metricsOptions.map(mo => {
        return {
          caption: mo.caption,
          color: mo.color
        }
      })
    }));
  }

  dispose(): void {
    this.dataSet.eventTarget.removeListener(DataSetEventType.Changed, this);

    for (let plot of this.plots) {
      plot.dispose();
    }

    if (this.resizeSensor) {
      this.resizeSensor.detach(this.resizeSensorCallback);
    }

    this.jqueryElt.remove();

    this.legend?.dispose();
    this.headerLabel?.dispose();
  }

  setDataSet(newDataSet: DataSet<TItemType, XDimensionType, YDimensionType>){
    this.dataSet.eventTarget.removeListener(DataSetEventType.Changed, this);
    this.dataSet = newDataSet;
    this.dataSet.eventTarget.addListener(DataSetEventType.Changed, this);
    this.plots.forEach(plot => {
      plot.setDataSet(newDataSet);
    });
  }

  setHeaderOptions(options: HeaderOptions) {
    this.headerLabel?.setOptions(options);
  }

  get minZoomLevel(): number {
    return Chart.MinZoomLevel;
  }

  resize(){
    this._size = new Size(this.jqueryElt.innerWidth() ?? 0, this.jqueryElt.innerHeight() ?? 0);
    this._renderer.setSize(this._size);
    this.updateNumeric(this.visibleRectAsNumeric);
  }

  private onFrameRenderedCycle(){
    if(!this.isDisposed){
      if(this.isAsyncFitToViewRequired && this.isFitToViewModeEnabled) {
        this.fitToView();
        this.isAsyncFitToViewRequired = false;
      }

      window.requestAnimationFrame(this.onFrameRenderedCycle.bind(this));
    }
  }

  protected dimensionalVisibleRectToNumeric(visibleRect: DataRect<XDimensionType, YDimensionType extends undefined ? number : Exclude<YDimensionType, undefined>>): NumericDataRect {
    return new NumericDataRect(
      this.dataSet.xDimensionValueToNumeric(visibleRect.minX) ?? 0,
      this.dataSet.xDimensionValueToNumeric(visibleRect.maxX) ?? 1,
      this.dataSet.yDimensionValueToNumeric(visibleRect.minY as YDimensionType) ?? 0,
      this.dataSet.yDimensionValueToNumeric(visibleRect.maxY as YDimensionType) ?? 1)
  }

  protected numericVisibleRectToDimensional(visibleRectAsNumeric: NumericDataRect): DataRect<XDimensionType, YDimensionType extends undefined ? number : Exclude<YDimensionType, undefined>> | undefined {
    let minXasDimVal = this.dataSet.numericToXDimensionValue(visibleRectAsNumeric.minX);
    let minYasDimVal = this.dataSet.numericToYDimensionValue(visibleRectAsNumeric.minY);
    let maxXasDimVal = this.dataSet.numericToXDimensionValue(visibleRectAsNumeric.maxX);
    let maxYasDimVal = this.dataSet.numericToYDimensionValue(visibleRectAsNumeric.maxY);

    return (minXasDimVal !== undefined && minYasDimVal !== undefined && maxXasDimVal !== undefined && maxYasDimVal !== undefined) ?
      new DataRect<XDimensionType, YDimensionType extends undefined ? number : Exclude<YDimensionType, undefined>>(minXasDimVal, maxXasDimVal, minYasDimVal as YDimensionType extends undefined ? number : Exclude<YDimensionType, undefined>, maxYasDimVal as YDimensionType extends undefined ? number : Exclude<YDimensionType, undefined>) : undefined;
  }
}
