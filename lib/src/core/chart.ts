import Konva from "konva";
import {CoordinateTransformationStatic, DataRect, DataTransformation, NumericPoint, Size} from "../model";
import {AxisOptions, ChartOptions, ChartOptionsDefaults, LabeledAxisOptions, NumericAxisOptions} from "../options";
import {AxisBase, AxisOrientation, AxisTypes, LabeledAxis, NumericAxis} from "./axis";
import extend from "lodash-es/extend";
import {Grid} from "./grid";
import {Plot, RenderableItem, Renderer} from "../core";
import {LayerName} from "./layer-name";
import {inject} from "tsyringe";
import {KeyboardNavigation, KeyboardNavigationsFactory} from "./keyboard";
import {MouseNavigation} from "./mouse-navigation";

export class Chart extends RenderableItem {

  public static readonly MinZoomLevel: number = 1e-8;

  private readonly _id: number;

  private readonly _location: NumericPoint;
  private readonly _size: Size;
  private readonly plots: Plot[];

  private _dataRect: DataRect;

  private readonly keyboardNavigation: KeyboardNavigation | undefined;
  private readonly mouseNavigation: MouseNavigation | undefined;

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
   * @param {ChartOptions} options - Chart options.
   * @param keyboardNavigationsFactory
   * */
  constructor(location: NumericPoint, size: Size, dataRect: DataRect, options?: ChartOptions,
              @inject("KeyboardNavigationFactory") private keyboardNavigationsFactory?: KeyboardNavigationsFactory ) {
    super();

    this._id = Chart.getNextId();

    this._location = location;
    this._size = size;
    this._dataRect = dataRect;

    this.options = extend(ChartOptionsDefaults.Instance, options);

    let dataTransformation: DataTransformation = new DataTransformation(CoordinateTransformationStatic.buildFromOptions(this.options?.axes));

    this.horizontalAxis = this.createAxis(dataTransformation, AxisOrientation.Horizontal, this.options?.axes.horizontal);
    this.verticalAxis = this.createAxis(dataTransformation, AxisOrientation.Vertical, this.options?.axes.vertical);

    this.chartGrid = new Grid(location, size, this.options.grid);

    this.plots = [];

    if (this.options.isNavigationEnabled) {
      this.keyboardNavigation = this.keyboardNavigationsFactory?.create();
      this.mouseNavigation = new MouseNavigation(location, size)
    }
  }

  getLayer(layerName: string): Konva.Layer {
    throw new Error("Method not implemented.");
  }

  getDependantLayers(): Array<string> {
    return [LayerName.Chart, LayerName.Labels];
  }

  override attach(renderer: Renderer) {
    super.attach(renderer);

    Chart.createLayers(renderer);

    if(this.verticalAxis) {
      renderer.add(this.verticalAxis);
    }

    if(this.horizontalAxis){
      renderer.add(this.horizontalAxis);
    }

    renderer.add(this.chartGrid);

    for (let plot of this.plots) {
      renderer.add(plot);
    }

    if (this.options.header) {
      let labelLocation = this._location;

      this.headerLabel = new RenderedLabel(header, headerFont, labelLocation, this._size.width, HorizontalAlignment.Center);
      var foregroundColor = container.getAttribute('data-header-foreground-color');
      if (foregroundColor != undefined) {
        this._headerLabel.foregroundColor = foregroundColor;
      }
      renderer.add(this._headerLabel);

    }
    else {
      this._headerLabel = null;
    }

    this.update(this._location, this._size, this._dataRect);

    this.renderer = renderer;
  }

  override detach() {
    let renderer = this.getRenderer();
    if (renderer) {
      Chart.destroyLayers(renderer);
    }
    super.detach();
  }

  /**
   * Updates chart's new instance of chart.
   * @param {DataRect} dataRect - new visible rectangle for chart
   * */
  update(dataRect: DataRect) {
    this._dataRect = dataRect;

    let labelOffsetY = 0;
    let labelYtopMargin = 0;

    if (this._headerLabel != null) {
      let labelActualHeight = this._headerLabel.getActualHeight();
      labelOffsetY += this._labelVerticalMargin * 2 + labelActualHeight;
    }

    let horizontalRange = this._dataRect.getHorizontalRange();
    let verticalRange = this._dataRect.getVerticalRange();

    let horizontalAxisHeight = 0;
    if (this._horizontalAxisType != AxisTypes.None) {
      horizontalAxisHeight = this._horizontalAxis.getActualHeight();
    }

    let locationWithOffset = new NumericPoint(this._location.x, this._location.y + labelOffsetY);

    this._verticalAxis.update(locationWithOffset, verticalRange, new Size(null, this._size.height - horizontalAxisHeight - labelOffsetY));

    let verticalAxisWidth = this._verticalAxis.getActualWidth();
    let verticalAxisHeight = this._verticalAxis.getActualHeight();

    if (this._horizontalAxisType != AxisTypes.None) {
      this._horizontalAxis.update(
        new NumericPoint(this._location.x + verticalAxisWidth,
          this._location.y + verticalAxisHeight + labelOffsetY - labelYtopMargin),
        horizontalRange,
        new Size(this._size.width - verticalAxisWidth, null));
    }

    let horizontalAxisWidth = 0;
    let horizontalAxisWidth = this._size.width - verticalAxisWidth

    let gridLocation = new NumericPoint(this._location.x + verticalAxisWidth, this._location.y + labelOffsetY);


    let horizontalAxisTicks = null;
    if (this._horizontalAxisType != AxisTypes.None) {
      horizontalAxisTicks = this._horizontalAxis.getScreenTicks();
    }

    this._chartGrid.update(
      gridLocation,
      new Size(horizontalAxisWidth, verticalAxisHeight),
      this._verticalAxis.getScreenTicks(), horizontalAxisTicks);

    if (this._navigationLayer != null) {
      this._navigationLayer.update(
        gridLocation,
        new Size(horizontalAxisWidth, verticalAxisHeight));
    }

    for (let i = 0; i < this._plots.length; i++) {
      let plot = this._plots[i];

      plot.setScreen(new DataRect(gridLocation.x, gridLocation.y, horizontalAxisWidth, verticalAxisHeight));
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
    } else if (options.axisType == AxisTypes.LabeledAxis) {
      return new LabeledAxis(axisLocation, orientation, axisRange, dataTransformation, options as LabeledAxisOptions, axisWidth, axisHeight);
    } else if (options.axisType == AxisTypes.None) {
      return undefined;
    } else throw new Error("Specified axis type is not supported");
  }

  private static createLayers(renderer: Renderer) {
    renderer.createLayers(Object.values(LayerName));
  }

  private static destroyLayers(renderer: Renderer) {
    renderer.destroyLayers(Object.values(LayerName));
  }
}
