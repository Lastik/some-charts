import Konva from "konva";
import extend from "lodash-es/extend";
import {Grid} from "./grid";
import {Plot, PlotFactory} from "./plots";
import {DataSet, DataSetEventType, DimensionType} from "../data";
import {Renderer} from "../renderer";
import {ChartRenderableItem} from "./chart-renderable-item";
import {KeyboardNavigation, KeyboardNavigationsFactory} from "./navigation";
import {MouseNavigation} from "./navigation";
import {
  NumericPoint,
  Size,
  DataRect,
  DataTransformation,
  CoordinateTransformationStatic,
  Point
} from "../geometry";

import {
  PlotOptionsClass, PlotOptionsClassFactory,
  AxisOptions, ChartOptions, ChartOptionsDefaults,
  NumericAxisOptions, PlotOptions
} from "../options";

import {
  EventBase,
  EventListener
} from "../events";

import {AxisBase, AxisOrientation, AxisTypes, LabeledAxis, NumericAxis} from "./axis";
import {LayerId} from "../layer-id";
import {Legend} from "./legend";
import {IDisposable} from "../i-disposable";
import {Label} from "./label";

export class Chart<TItemType = any,
  XDimensionType extends number | string | Date = number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined>
    implements EventListener<DataSetEventType>, IDisposable {

  public static readonly MinZoomLevel: number = 1e-8;

  private elementSelector: string;

  private readonly _id: number;

  private _renderer: Renderer;

  private readonly _location: NumericPoint;
  private readonly _size: Size;

  private readonly contentItems: ChartRenderableItem[];
  private readonly plots: Plot<PlotOptions, PlotOptionsClass, TItemType, XDimensionType, YDimensionType>[];

  private _visibleRect: DataRect;

  private readonly keyboardNavigation: KeyboardNavigation | undefined;
  private readonly mouseNavigation: MouseNavigation | undefined;
  private readonly headerLabel: Label | undefined;

  private dataSet: DataSet<TItemType, XDimensionType, YDimensionType>;

  private legend: Legend | undefined;

  private layersIds: Array<string>;

  public get id(): number{
    return this._id;
  }

  public get location(): NumericPoint{
    return this._location;
  }

  public get size(): Size {
    return this._size;
  }

  public get visibleRect(): DataRect {
    return this._visibleRect;
  }

  private options: ChartOptions;

  private horizontalAxis?: AxisBase<any, any>;
  private verticalAxis?: AxisBase<any, any>;

  private chartGrid: Grid;

  private static currentChartId: number;

  /**
   * Creates new instance of chart.
   * @param {string} elementSelector - element selector.
   * @param {NumericPoint} location - Chart's location relative to left up corner of canvas.
   * @param {Size} size - Chart's size
   * @param {DataRect} visibleRect - Currently visible rectangle on chart.
   * @param {DataSet} dataSet - DataSet with data for this chart.
   * @param {ChartOptions} options - Chart options.
   * @param {PlotFactory} plotFactory - injected factory to create plots based on options.
   * @param {KeyboardNavigationsFactory} keyboardNavigationsFactory - injected factory to create keyboard navigation.
   * */
  constructor(elementSelector: string,
              location: NumericPoint, size: Size, visibleRect: DataRect,
              dataSet: DataSet<TItemType, XDimensionType, YDimensionType>,
              options?: ChartOptions,
              private plotFactory: PlotFactory = PlotFactory.Instance,
              private keyboardNavigationsFactory: KeyboardNavigationsFactory = KeyboardNavigationsFactory.Instance ) {

    this.elementSelector = elementSelector;

    this._id = Chart.getNextId();

    this.options = extend(ChartOptionsDefaults.Instance, options);

    this._renderer = new Renderer(elementSelector, size, this.options!.renderer!);

    this.layersIds = [];

    this.layersIds.push(...Chart.getCommonLayersIds());

    this._location = location;
    this._size = size;
    this._visibleRect = visibleRect;

    this.dataSet = dataSet;
    this.dataSet.eventTarget.addListener(DataSetEventType.Changed, this);

    let dataTransformation: DataTransformation = new DataTransformation(CoordinateTransformationStatic.buildFromOptions(this.options?.axes!));

    this.contentItems = [];

    this.horizontalAxis = this.createAxis(dataTransformation, AxisOrientation.Horizontal, this.options?.axes!.horizontal);
    this.verticalAxis = this.createAxis(dataTransformation, AxisOrientation.Vertical, this.options?.axes!.vertical);

    this.chartGrid = new Grid(location, size, this.options.grid);

    if (this.options.header) {
      this.headerLabel = new Label(location, size.width, this.options.header);
      this.headerLabel.placeOnChart(this as Chart)
    }

    if (this.options.navigation!.isEnabled) {
      this.keyboardNavigation = this.keyboardNavigationsFactory?.create();
      this.mouseNavigation = new MouseNavigation(location, size)
    }

    this.plots = [];

    let plotOptionsArr = this.options.plots!.map(po => PlotOptionsClassFactory.buildPlotOptionsClass(po)).filter(po => po !== undefined) as PlotOptionsClass[];


    for(let plotOptions of plotOptionsArr) {
      let plot = this.plotFactory?.createPlot<TItemType, XDimensionType, YDimensionType>(dataSet, dataTransformation, plotOptions);
      if (plot) {
        this.plots.push(plot);

        let plotLayers = plot.getDependantLayers();
        for(let plotLayerId of plotLayers) {
          if (this.layersIds.indexOf(plotLayerId) < 0) {
            this.layersIds.push(plotLayerId);
          }
        }
      }
    }

    Chart.createLayers(this.getRenderer(), this.layersIds);

    if(this.horizontalAxis) {
      this.horizontalAxis.placeOnChart(this as Chart);
    }

    if(this.verticalAxis) {
      this.verticalAxis.placeOnChart(this as Chart)
    }

    this.chartGrid.placeOnChart(this as Chart)

    if (this.options.header && this.headerLabel) {
      this.headerLabel.placeOnChart(this as Chart)
    }

    for(let plot of this.plots){
      plot.attach(this._renderer);
      plot.placeOnChart(this as Chart);
    }

    for(let contentItem of this.contentItems){
      contentItem.attach(this._renderer);
    }

    this.updateLabeledAxesLabels();

    this.buildLegend(plotOptionsArr);

    this.update(this.visibleRect);
  }

  getRenderer(): Renderer{
    return this._renderer;
  }

  getLayer(layerId: string): Konva.Layer | undefined {
    let renderer = this.getRenderer();
    return renderer ? <Konva.Layer>renderer.getLayer(layerId): undefined;
  }

  getDependantLayers(): Array<string> {
    return [LayerId.Chart, LayerId.Labels];
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
   * Updates chart's new instance of chart.
   * @param {DataRect} visibleRect - new visible rectangle for chart
   * */
  update(visibleRect: DataRect) {
    this._visibleRect = visibleRect;

    let offsetYAfterHeader = 0;

    if (this.headerLabel) {
      offsetYAfterHeader += this.headerLabel.height;
    }

    let horizontalRange = this._visibleRect.getHorizontalRange();
    let verticalRange = this._visibleRect.getVerticalRange();

    let horizontalAxisHeight = 0;
    if (this.options.axes!.horizontal.axisType != AxisTypes.None) {
      horizontalAxisHeight = this.horizontalAxis!.size.height;
    }

    let locationWithOffset = new NumericPoint(this._location.x, this._location.y + offsetYAfterHeader);

    if(this.verticalAxis) {
      this.verticalAxis.update(locationWithOffset, verticalRange, undefined, this._size.height - horizontalAxisHeight - offsetYAfterHeader);
    }

    let verticalAxisSize = this.verticalAxis?.size;

    if (this.horizontalAxis) {
      this.horizontalAxis.update(
        new NumericPoint(this._location.x + (verticalAxisSize?.width ?? 0),
          this._location.y + (verticalAxisSize?.height ?? 0) + offsetYAfterHeader - (this.options.header?.verticalPadding ?? 0)),
        horizontalRange,
        this._size.width - (verticalAxisSize?.width ?? 0), undefined);
    }

    let horizontalAxisSize = this.horizontalAxis?.size;

    let gridLocation = new NumericPoint(this._location.x + (verticalAxisSize?.width ?? 0), this._location.y + offsetYAfterHeader);
    let gridSize = new Size(horizontalAxisSize?.width ?? this.size.width, verticalAxisSize?.height ?? (this.size.height - offsetYAfterHeader));

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

    for (let plot of this.plots) {
      plot.setScreen(new DataRect(gridLocation.x, gridLocation.y, gridSize.width, gridSize.height));
      plot.setVisible(this._visibleRect);
    }
  }

  /**
   * Fits all plots on chart to view them
   * */
  fitToView() {
    if(this.plots.length) {
      let firstPlot = this.plots[0];
      let chartBoundingRect = firstPlot.getBoundingRectangle();
      if (chartBoundingRect) {
        for (let i = 1; i < this.plots.length; i++) {
          let plot = this.plots[i];
          let plotBoundingRect = plot.getBoundingRectangle();
          if(plotBoundingRect) {
            chartBoundingRect.merge(plotBoundingRect);
          }
        }

        let coeff = 0.03;

        let horSize = chartBoundingRect.getHorizontalRange().getLength();
        let verSize = chartBoundingRect.getVerticalRange().getLength();

        let offsetX = horSize * coeff;
        let offsetY = verSize * coeff;

        chartBoundingRect = new DataRect(
          chartBoundingRect.minX - offsetX / 2,
          chartBoundingRect.minY - offsetY / 2,
          chartBoundingRect.width + offsetX,
          chartBoundingRect.height + offsetY);

        if (this.options.navigation!.fixedTopBound) {
          chartBoundingRect = chartBoundingRect.withHeight((this.options.navigation!.fixedTopBound - chartBoundingRect.minY) * (1 + coeff));
        }
        if (chartBoundingRect.height == 0) {
          chartBoundingRect = chartBoundingRect.withHeight(1);
        }
        if (chartBoundingRect.width == 0) {
          chartBoundingRect = chartBoundingRect.withWidth(0);
        }
        this.update(chartBoundingRect);
      }
    }
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

    let axisRange = orientation === AxisOrientation.Vertical ? this.visibleRect.getVerticalRange() : this.visibleRect.getHorizontalRange();

    if (options.axisType == AxisTypes.NumericAxis) {
      return new NumericAxis(axisLocation, orientation, axisRange, dataTransformation, options as NumericAxisOptions, axisWidth, axisHeight);
    } else if (options.axisType === AxisTypes.LabeledAxis) {
      return new LabeledAxis(axisLocation, orientation, axisRange, dataTransformation, options as AxisOptions, axisWidth, axisHeight);
    } else if (options.axisType === AxisTypes.None) {
      return undefined;
    } else throw new Error("Specified axis type is not supported");
  }

  private static getCommonLayersIds(){
    return Object.values(LayerId);
  }

  private static createLayers(renderer: Renderer, layersIds: Array<string>) {
    renderer.createLayers(layersIds);
  }

  eventCallback(event: EventBase<DataSetEventType>, options?: any): void {
    if(event.type === DataSetEventType.Changed){
      this.updateLabeledAxesLabels();
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

    this.legend = new Legend(this.elementSelector, this.size, this.options.legend);

    this.legend.updateContent(plotOptionsArr.flatMap(po => {
      return po.metricsOptions
    }));
  }

  dispose(): void {
    this.dataSet.eventTarget.removeListener(DataSetEventType.Changed, this);
  }

  get minZoomLevel(): number {
    return Chart.MinZoomLevel;
  }
}
