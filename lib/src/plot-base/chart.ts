import Konva from "konva";
import {
  NumericPoint, Size,
  DataRect, DataTransformation,
  CoordinateTransformationStatic
} from "../model";
import {
  ChartOptions,
  ChartOptionsDefaults,
  NumericAxisOptions,
  LabeledAxisOptions} from "../options";
import {
  AxisBase,
  NumericAxis,
  LabeledAxis,
  AxisTypes,
  AxisOrientation} from "./axis";
import extend from "lodash-es/extend";
import {Grid} from "./grid";
import {RenderableItem} from "../core";
import {LayerName} from "./layer-name";

export class Chart extends RenderableItem {

  public static readonly MinZoomLevel: number = 1e-8;

  private readonly _id: number;
  private readonly _location: NumericPoint;
  private readonly _size: Size;
  private readonly _dataRect: DataRect;

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
   * */
  constructor(location: NumericPoint, size: Size, dataRect: DataRect, options?: ChartOptions) {
    super();

    this._id = Chart.getNextId();

    this._location = location;
    this._size = size;
    this._dataRect = dataRect;

    this.options = extend(ChartOptionsDefaults.Instance, options);

    let horizontalAxisOptions = this.options?.axes.horizontal;
    let verticalAxisOptions = this.options?.axes.vertical;

    let dataTransformation: DataTransformation = new DataTransformation(CoordinateTransformationStatic.buildFromOptions(this.options?.axes));

    if (horizontalAxisOptions.axisType == AxisTypes.NumericAxis) {
      this.horizontalAxis = new NumericAxis(new NumericPoint(location.x, location.y + size.height), AxisOrientation.Horizontal, dataRect.getHorizontalRange(), dataTransformation, horizontalAxisOptions as NumericAxisOptions, size.width, undefined);
    } else if (horizontalAxisOptions.axisType == AxisTypes.LabeledAxis) {
      this.horizontalAxis = new LabeledAxis(new NumericPoint(location.x, location.y + size.height), AxisOrientation.Horizontal, dataRect.getHorizontalRange(), dataTransformation, horizontalAxisOptions as LabeledAxisOptions, size.width, undefined);
    }

    if (verticalAxisOptions.axisType == AxisTypes.NumericAxis) {
      this.verticalAxis = new NumericAxis(location, AxisOrientation.Vertical, dataRect.getVerticalRange(), dataTransformation, verticalAxisOptions as NumericAxisOptions, undefined, size.height);
    } else if (horizontalAxisOptions.axisType == AxisTypes.LabeledAxis) {
      this.verticalAxis = new LabeledAxis(location, AxisOrientation.Vertical, dataRect.getVerticalRange(), dataTransformation, verticalAxisOptions as LabeledAxisOptions, undefined, size.height);
    }

    this.chartGrid = new Grid(location, size, this.options.grid);


    this._plots = [];

    if (enableNavigation) {
      this._navigationLayer = new NavigationLayer(location, size);

      this._navigationLayer.eventTarget.addListener("dragging", function (event, state) {
        var deltaX = -event.deltaX;
        var deltaY = event.deltaY;

        var chart = state;

        var rect = chart._dataRect;
        var horizontalRange = rect.getHorizontalRange();
        var verticalRange = rect.getVerticalRange();

        var size = chart._chartGrid.getSize();

        var width = size.width;
        var height = size.height;

        var dataWidth = horizontalRange.getLength();
        var dataHeight = verticalRange.getLength();

        var propX = dataWidth / width;
        var propY = dataHeight / height

        deltaX = deltaX * propX;
        deltaY = deltaY * propY;

        var rangeX = new Range(horizontalRange.min + deltaX, horizontalRange.max + deltaX, false);
        var rangeY = new Range(verticalRange.min + deltaY, verticalRange.max + deltaY, false);

        var rect = new DataRect(rangeX.min, rangeY.min, rangeX.getLength(), rangeY.getLength());

        chart.update(chart._location, chart._size, rect);
      }, this);

      this._navigationLayer.eventTarget.addListener("multitouchZooming", function (event, state) {
        var prev = event.prevRect;
        var cur = event.curRect;

        var chart = state;

        var size = chart._chartGrid.getSize();

        var width = size.width;
        var height = size.height;

        var dataRect = chart._dataRect;

        var dataWidth = dataRect.getHorizontalRange().getLength();
        var dataHeight = dataRect.getVerticalRange().getLength();

        var horizontalRange = dataRect.getHorizontalRange();
        var verticalRange = dataRect.getVerticalRange();

        var propX = dataWidth / width;
        var propY = dataHeight / height

        var prevLeftTop = prev.getMinXMinY();
        var prevRightBottom = prev.getMaxXMaxY();

        var curLeftTop = cur.getMinXMinY();
        var curRightBottom = cur.getMaxXMaxY();

        var leftTopDeltaX = -(curLeftTop.x - prevLeftTop.x) * propX;
        var leftTopDeltaY = (curLeftTop.y - prevLeftTop.y) * propY;

        var rightBottomDeltaX = -(curRightBottom.x - prevRightBottom.x) * propX;
        var rightBottomDeltaY = (curRightBottom.y - prevRightBottom.y) * propY;

        var rangeX = new Range(horizontalRange.min + leftTopDeltaX, horizontalRange.max + rightBottomDeltaX, false);
        var rangeY = new Range(verticalRange.min + rightBottomDeltaY, verticalRange.max + leftTopDeltaY, false);

        var newRect = new DataRect(rangeX.min, rangeY.min, rangeX.getLength(), rangeY.getLength());

        chart.update(chart._location, chart._size, newRect);

      }, this);

      this._navigationLayer.eventTarget.addListener("scrolling", function (event, state) {
        var chart = state;
        var delta = event.delta;
        chart.zoom(delta);
      }, this);
    }
  }

  getLayer(layerName: string): Konva.Layer {
    throw new Error("Method not implemented.");
  }

  getDependantLayers(): Array<string> {
    return [LayerName.Chart];
  }

  update(location, size, dataRect) {

  }

  private static getNextId(): number{
    return Chart.currentChartId++;
  }
}
