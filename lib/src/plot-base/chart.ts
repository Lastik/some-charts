import Konva from "konva";
import {NumericPoint} from "../model/point/numeric-point";
import {Size} from "../model/size";
import {DataRect} from "../model/data-rect";
import {ChartOptions, ChartOptionsDefaults} from "../options/chart-options";
import {NumericAxis} from "./axis/numeric/numeric-axis";
import {AxisBase} from "./axis/axis-base";

export class Chart {
  private location: NumericPoint;
  private size: Size;
  private dataRect: DataRect;

  private options: ChartOptions;

  private horizontalAxis?: AxisBase<any>;
  private verticalAxis: AxisBase<any>;

  constructor(location: NumericPoint, size: Size, dataRect: DataRect, options?: ChartOptions) {
    /// <summary>Creates new instance of chart.</summary>
    /// <param name="location" type="Point">Chart's location relative to left up corner of canvas.</param>
    /// <param name="size" type="Size">Chart's size.</param>
    /// <param name="dataRect" type="DataRect">Currently visible rectangle on chart.</param>
    /// <param name="horizontalAxisType" type="Number">Type of horizontal axis.</param>
    /// <param name="enableNavigation" type="Boolean">Op  tional parameter, which indicates, whether chart navigation is enabled. Default value is true.</param>
    this.location = location;
    this.size = size;
    this.dataRect = dataRect;

    this.options = options ?? ChartOptionsDefaults.Instance;

    let horizontalAxisOptions = this.options.axes.horizontal;

    if (horizontalAxisOptions.axisType == AxisTypes.NumericAxis) {
      this.horizontalAxis = new NumericAxis(new NumericPoint(location.x, location.y + size.height), AxisOrientation.Horizontal, dataRect.getHorizontalRange(), size.width, undefined, horizontalAxisOptions);
    } else if (horizontalAxisOptions.axisType == AxisTypes.StringAxis) {
      this.horizontalAxis = new StringAxis(new NumericPoint(location.x, location.y + size.height), AxisOrientation.Horizontal, dataRect.getHorizontalRange(), size.width, undefined, null);
    }


    this.verticalAxis = new NumericAxis(location, dataRect.getVerticalRange(), new Size(null, size.height), Orientation.Vertical);

    this._horizontalAxisType = horizontalAxisType;

    if (horizontalAxisType == AxisTypes.NumericAxis) {
      this._horizontalAxis = new NumericAxis(new NumericPoint(location.x, location.y + size.height), dataRect.getHorizontalRange(), new Size(size.width, null), Orientation.Horizontal);
    } else if (horizontalAxisType == AxisTypes.StringAxis) {
      this._horizontalAxis = new StringAxis(new NumericPoint(location.x, location.y + size.height), dataRect.getHorizontalRange(), new Size(size.width, null), Orientation.Horizontal, null);
    } else {
      this._horizontalAxis = null;
    }
    this._chartGrid = new Grid(location, size, null, null);

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

}
