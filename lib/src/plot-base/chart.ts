import Konva from "konva";
import {CoordinateTransformationStatic, DataRect, DataTransformation, NumericPoint, Size} from "../model";
import {AxisOptions, ChartOptions, ChartOptionsDefaults, LabeledAxisOptions, NumericAxisOptions} from "../options";
import {AxisBase, AxisOrientation, AxisTypes, LabeledAxis, NumericAxis} from "./axis";
import extend from "lodash-es/extend";
import {Grid} from "./grid";
import {RenderableItem} from "../core";
import {LayerName} from "./layer-name";
import {inject} from "tsyringe";
import {KeyboardNavigation, KeyboardNavigationsFactory} from "./keyboard";
import {MouseNavigation} from "./mouse-navigation";

export class Chart extends RenderableItem {

  public static readonly MinZoomLevel: number = 1e-8;

  private readonly _id: number;
  private readonly _location: NumericPoint;
  private readonly _size: Size;
  private readonly _dataRect: DataRect;
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

    this._plots = [];

    if (this.options.isNavigationEnabled) {
      this.keyboardNavigation = this.keyboardNavigationsFactory?.create();
      this.mouseNavigation = new MouseNavigation(location, size)
    }
  }

  getLayer(layerName: string): Konva.Layer {
    throw new Error("Method not implemented.");
  }

  getDependantLayers(): Array<string> {
    return [LayerName.Chart];
  }

  /**
   * Updates chart's  new instance of chart.
   * */
  update(location, size, dataRect) {
    /// <summary>Updates chart's state</summary>
    /// <param name="location" type="Point">Chart's location relative to left up corner of canvas.</param>
    /// <param name="size" type="Size">Chart's size.</param>
    /// <param name="dataRect" type="DataRect">Current visible rectangle of chart.</param>
    this._location = location;
    this._size = size;
    this._dataRect = dataRect;

    var labelOffsetY = 0;
    var labelYtopMargin = 0;

    if (this._headerLabel != null) {
      var labelActualHeight = this._headerLabel.getActualHeight();
      labelOffsetY += this._labelVerticalMargin * 2 + labelActualHeight;
    }

    var horizontalRange = this._dataRect.getHorizontalRange();
    var verticalRange = this._dataRect.getVerticalRange();

    var horizontalAxisHeight = 0;
    if (this._horizontalAxisType != AxisTypes.None) {
      horizontalAxisHeight = this._horizontalAxis.getActualHeight();
    }

    var locationWithOffset = new NumericPoint(this._location.x, this._location.y + labelOffsetY);

    this._verticalAxis.update(locationWithOffset, verticalRange, new Size(null, this._size.height - horizontalAxisHeight - labelOffsetY));

    var verticalAxisWidth = this._verticalAxis.getActualWidth();
    var verticalAxisHeight = this._verticalAxis.getActualHeight();

    if (this._horizontalAxisType != AxisTypes.None) {
      this._horizontalAxis.update(
        new NumericPoint(this._location.x + verticalAxisWidth,
          this._location.y + verticalAxisHeight + labelOffsetY - labelYtopMargin),
        horizontalRange,
        new Size(this._size.width - verticalAxisWidth, null));
    }

    var horizontalAxisWidth = 0;
    var horizontalAxisWidth = this._size.width - verticalAxisWidth

    var gridLocation = new NumericPoint(this._location.x + verticalAxisWidth, this._location.y + labelOffsetY);


    var horizontalAxisTicks = null;
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

    for (var i = 0; i < this._plots.length; i++) {
      var plot = this._plots[i];

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
                     options: AxisOptions): AxisBase<any, any>{
    let axisWidth = orientation === AxisOrientation.Vertical ? undefined : this.size.width;
    let axisHeight = orientation === AxisOrientation.Horizontal ? this.size.height : undefined;

    let axisLocation = orientation === AxisOrientation.Vertical ? this.location:
      new NumericPoint(this.location.x, this.location.y + this.size.height);

    let axisRange = orientation === AxisOrientation.Vertical ? this.dataRect.getVerticalRange(): this.dataRect.getHorizontalRange();

    if (options.axisType == AxisTypes.NumericAxis) {
      return new NumericAxis(axisLocation, orientation, axisRange, dataTransformation, options as NumericAxisOptions, axisWidth, axisHeight);
    } else if (options.axisType == AxisTypes.LabeledAxis) {
      return new LabeledAxis(axisLocation, orientation, axisRange, dataTransformation, options as LabeledAxisOptions, axisWidth, axisHeight);
    }
    else throw new Error("Specified axis type is not supported");
  }
}
