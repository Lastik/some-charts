import Konva from "konva";
import {
  CoordinateTransformationStatic,
  DataRect,
  DataTransformation,
  EventBase,
  EventListener,
  NumericPoint, Point,
  Size
} from "../model";
import {AxisOptions, ChartOptions, ChartOptionsDefaults, NumericAxisOptions} from "../options";
import {AxisBase, AxisOrientation, AxisTypes, LabeledAxis, NumericAxis} from "./axis";
import extend from "lodash-es/extend";
import {Grid} from "./grid";
import {ChartRenderableItem, Plot, RenderableItem, Renderer} from "../core";
import {LayerName} from "./layer-name";
import {inject} from "tsyringe";
import {KeyboardNavigation, KeyboardNavigationsFactory} from "./keyboard";
import {MouseNavigation} from "./mouse-navigation";
import {Label} from "../plots";
import {DataSet, DataSetEventType, DimensionType} from "./data";
import {IDisposable} from "../common";

export class Chart<TItemType,
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined>
    extends RenderableItem implements EventListener<DataSetEventType>, IDisposable {

  public static readonly MinZoomLevel: number = 1e-8;

  private readonly _id: number;

  private readonly _location: NumericPoint;
  private readonly _size: Size;

  private readonly contentItems: ChartRenderableItem[];
  private readonly plots: Plot<TItemType, XDimensionType, YDimensionType>[];

  private _dataRect: DataRect;

  private readonly keyboardNavigation: KeyboardNavigation | undefined;
  private readonly mouseNavigation: MouseNavigation | undefined;
  private readonly headerLabel: Label | undefined;

  private dataSet: DataSet<TItemType, XDimensionType, YDimensionType>;

  public get id(): number{
    return this._id;
  }

  public get location(): NumericPoint{
    return this._location;
  }

  public get size(): Size {
    return this._size;
  }

  public get dataRect(): DataRect {
    return this._dataRect;
  }

  private options: ChartOptions;

  private horizontalAxis?: AxisBase<any, any>;
  private verticalAxis?: AxisBase<any, any>;

  private chartGrid: Grid;

  private static currentChartId: number;

  /**
   * Creates new instance of chart.
   * @param {NumericPoint} location - Chart's location relative to left up corner of canvas.
   * @param {Size} size - Chart's size
   * @param {DataRect} dataRect - Currently visible rectangle on chart.
   * @param {DataSet} dataSet - DataSet with data for this chart.
   * @param {ChartOptions} options - Chart options.
   * @param keyboardNavigationsFactory
   * */
  constructor(location: NumericPoint, size: Size, dataRect: DataRect,
              dataSet: DataSet<TItemType, XDimensionType, YDimensionType>,
              options?: ChartOptions,
              @inject("KeyboardNavigationFactory") private keyboardNavigationsFactory?: KeyboardNavigationsFactory ) {
    super();

    this._id = Chart.getNextId();

    this._location = location;
    this._size = size;
    this._dataRect = dataRect;

    this.dataSet = dataSet;
    this.dataSet.eventTarget.addListener(DataSetEventType.Changed, this);

    this.options = extend(ChartOptionsDefaults.Instance, options);

    let dataTransformation: DataTransformation = new DataTransformation(CoordinateTransformationStatic.buildFromOptions(this.options?.axes));

    this.contentItems = [];

    this.horizontalAxis = this.createAxis(dataTransformation, AxisOrientation.Horizontal, this.options?.axes.horizontal);
    if(this.horizontalAxis) {
      this.contentItems.push(this.horizontalAxis);
    }

    this.verticalAxis = this.createAxis(dataTransformation, AxisOrientation.Vertical, this.options?.axes.vertical);
    if(this.verticalAxis) {
      this.contentItems.push(this.verticalAxis);
    }

    this.chartGrid = new Grid(location, size, this.options.grid);
    this.contentItems.push(this.chartGrid);

    if (this.options.header) {
      this.headerLabel = new Label(location, size.width, this.options.header);
      this.contentItems.push(this.headerLabel);
    }

    this.plots = [];

    if (this.options.isNavigationEnabled) {
      this.keyboardNavigation = this.keyboardNavigationsFactory?.create();
      this.mouseNavigation = new MouseNavigation(location, size)
    }

    this.updateLabeledAxesLabels();
  }

  getLayer(layerName: string): Konva.Layer | undefined {
    let renderer = this.getRenderer();
    return renderer ? <Konva.Layer>renderer.getLayer(layerName): undefined;
  }

  getDependantLayers(): Array<string> {
    return [LayerName.Chart, LayerName.Labels];
  }

  override attach(renderer: Renderer) {
    super.attach(renderer);

    Chart.createLayers(renderer);

    for(let contentItem of this.contentItems){
      renderer.add(contentItem);
      contentItem.markDirty();
    }
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

  public addPlot(plot: Plot<TItemType, XDimensionType, YDimensionType>){
    this.addContentItem(plot);
  }

  override detach() {
    let renderer = this.getRenderer();
    if (renderer) {
      Chart.destroyLayers(renderer);

      for(let contentItem of this.contentItems){
        renderer.remove(contentItem);
      }
    }

    super.detach();
  }

  /**
   * Updates chart's new instance of chart.
   * @param {DataRect} dataRect - new visible rectangle for chart
   * */
  update(dataRect: DataRect) {
    this._dataRect = dataRect;

    let offsetYAfterHeader = 0;

    if (this.headerLabel) {
      offsetYAfterHeader += this.headerLabel.height;
    }

    let horizontalRange = this._dataRect.getHorizontalRange();
    let verticalRange = this._dataRect.getVerticalRange();

    let horizontalAxisHeight = 0;
    if (this.options.axes.horizontal.axisType != AxisTypes.None) {
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

    this.chartGrid.setLinesCoords(horizontalAxisTicks ?? [], verticalAxisTicks ?? []);

    if(this.mouseNavigation){
      this.mouseNavigation.update(gridLocation, gridSize);
    }

    for (let plot of this.plots) {
      plot.setScreen(new DataRect(gridLocation.x, gridLocation.y, gridSize.width, gridSize.height));
      plot.setVisible(this._dataRect);
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
    let axisHeight = orientation === AxisOrientation.Horizontal ? this.size.height : undefined;

    let axisLocation = orientation === AxisOrientation.Vertical ? this.location :
      new NumericPoint(this.location.x, this.location.y + this.size.height);

    let axisRange = orientation === AxisOrientation.Vertical ? this.dataRect.getVerticalRange() : this.dataRect.getHorizontalRange();

    if (options.axisType == AxisTypes.NumericAxis) {
      return new NumericAxis(axisLocation, orientation, axisRange, dataTransformation, options as NumericAxisOptions, axisWidth, axisHeight);
    } else if (options.axisType === AxisTypes.LabeledAxis) {
      return new LabeledAxis(axisLocation, orientation, axisRange, dataTransformation, options as AxisOptions, axisWidth, axisHeight);
    } else if (options.axisType === AxisTypes.None) {
      return undefined;
    } else throw new Error("Specified axis type is not supported");
  }

  private static createLayers(renderer: Renderer) {
    renderer.createLayers(Object.values(LayerName));
  }

  private static destroyLayers(renderer: Renderer) {
    renderer.destroyLayers(Object.values(LayerName));
  }

  eventCallback(event: EventBase<DataSetEventType>, options?: any): void {
    if(event.type === DataSetEventType.Changed){
      this.updateLabeledAxesLabels();
    }
  }

  protected updateLabeledAxesLabels() {
    if (this.options.axes.horizontal.axisType === AxisTypes.LabeledAxis) {
      if (this.dataSet.dimensionXType === DimensionType.String) {
        (<LabeledAxis>this.horizontalAxis).updateLabels(this.dataSet.dimensionXValues.map(v => <Point<string>>v.toPoint()));
      } else throw new Error('DataSet with labeled axis must have the corresponding dimension of string type!')
    }
    if (this.options.axes.vertical.axisType === AxisTypes.LabeledAxis) {
      if (this.dataSet.is2D) {
        if (this.dataSet.dimensionXType === DimensionType.String) {
          (<LabeledAxis>this.verticalAxis).updateLabels(this.dataSet.dimensionYValues!.map(v => <Point<string>>v.toPoint()));
        } else throw new Error('DataSet with labeled axis must have the corresponding dimension of string type!')
      } else throw new Error('1D DataSet can\'t be used with horizontal labeled axis!');
    }
  }

  dispose(): void {
    this.dataSet.eventTarget.removeListener(DataSetEventType.Changed, this);
  }
}
