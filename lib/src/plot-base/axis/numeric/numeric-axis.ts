import Konva from "konva";
import {AxisBase} from "../axis-base";
import {NumericMajorTicksGenerator} from "../ticks/numeric/numeric-major-ticks-generator";
import {NumericMinorTicksGenerator} from "../ticks/numeric/numeric-minor-ticks-generator";
import {NumericPoint} from "../../../model/point/numeric-point";
import {Size} from "../../../model/size";
import {AxisOptions, AxisOptionsDefaults} from "../../../options/axis-options";
import {MathHelper} from "../../../services/math-helper";
import {FontHelper} from "../../../services/font-helper";
import {NumericRange} from "../../../model/numeric-range";
import {Range} from "../../../model/range";
import {MinorTicksGenerator} from "../ticks/minor-ticks-generator";
import {MajorTicksGenerator} from "../ticks/major-ticks-generator";
import {CoordinateTransform} from "../../../services/coordinate-transform";
import {Tick} from "../ticks/tick";

export class NumericAxis extends AxisBase<number> {
  /**
   * Creates axis with numbers and ticks on it.
   * @param {NumericPoint} location - Axis location.
   * @param {Range} range - Axis range (it's min and max values)
   * @param {Size} size - Axis size.
   * @param {AxisOrientation} orientation - Axis orientation.
   * @param {AxisOptions} options
   */
  constructor(location: NumericPoint, range: NumericRange, size: Size, orientation: AxisOrientation, options?: AxisOptions) {
    super(location, range, size, orientation);
  }

  protected createMajorTicksGenerator(): MajorTicksGenerator<number> {
    return new NumericMajorTicksGenerator(this.options?.majorTickHeight ?? AxisOptionsDefaults.Instance.majorTickHeight);
  }

  protected createMinorTicksGenerator(): MinorTicksGenerator<number> {
    return new NumericMinorTicksGenerator(this.options?.minorTickHeight ?? AxisOptionsDefaults.Instance.minorTickHeight);
  }

  protected getTickScreenCoordinate(tick: Tick<number>, screenWidth: number, screenHeight: number, range: Range<number>): number {
    if (this.orientation == AxisOrientation.Horizontal)
      return CoordinateTransform.dataToScreenX(tick.value, range, screenWidth);
    else
      return CoordinateTransform.dataToScreenY(tick.value, range, screenHeight);
  }
}

(function (window) {

    var NumericAxis = function (location, range, size, orientation) {
        /// <summary>Axis with numbers and ticks on it.</summary>
        /// <param name="location" type="Point">Axis location.</param>
        /// <param name="range" type="Range">Axis range (it's min and max values).</param>
        /// <param name="size" type="Size">Axis size.</param>
        /// <param name="orientation" type="Number">Axis orientation.</param>
        AxisBase.call(this, location, range, size, orientation);

        this.ticksGenerator = new TicksGenerator();

        this._labelsSizesArr = null;
        this._ticksArr = null;

        this._ticksOnScreen = null;
        this._minorTicksOnScreen = null;

        this._units = '';

        this.compositeShape.drawFunc = function () {

        };
    }

    NumericAxis.prototype = new AxisBase(new NumericPoint(0, 0), new Range(0, 0, false), new Size(0, 0), Orientation.Horizontal);

    NumericAxis.increaseRatio = 2;
    NumericAxis.decreaseRatio = 1.5;
    NumericAxis.maxTickArrangeIterations = 12;

    var p = NumericAxis.prototype;

    /*Internal state variables.*/
    p._labelsSizesArr = null;
    p._minorTicksOnScreen = null;
    p._ticksArr = null;
    /***************************/

    p.ticksGenerator = null;

    //Format is used to print
    p._units = null;

    p.setUnits = function (units, addDelimiter) {
        /// <summary>Specifies units.</summary>
        /// <param name="units" type="String">Units.</param>
        /// <param name="addDelimiter" type="String">True, if special delimiter must be specified between value and units.</param>
        if (!addDelimiter)
            this._units = units;
        else
            this._units = ' ' + units;
    }


    p._updateBase = p.update;
    p.update = function (location, range, size) {
        /// <summary>Updates axis state.</summary>
        /// <param name="location" type="Point">NumericAxis location.</param>
        /// <param name="range" type="Range">NumericAxis range.</param>
        /// <param name="size" type="Size">NumericAxis size.</param>
        this._updateBase(location, range, size);
        NumericAxis._updateInternal(this, location, range, size);
    }

    NumericAxis._updateInternal = function (axis, location, range, size) {
        axis._ticksArr = null;
        axis._labelsSizesArr = null;

        var ticks = NumericAxis._generateTicks(axis, range, size);
        var minorTicks = axis.ticksGenerator.generateMinorTicks(range, ticks);

        axis._ticksOnScreen = [];
        axis._minorTicksOnScreen = [];

        for (var i = 0; i < ticks.length; i++) {
            var tick = ticks[i];
            axis._ticksOnScreen.push(axis.getCoordinateFromTick(tick, size.width, size.height, range));
        }

        for (var i = 0; i < minorTicks.length; i++) {
            var tick = minorTicks[i];
            axis._minorTicksOnScreen.push(axis.getCoordinateFromTick(tick, size.width, size.height, range));
        }

        axis.compositeShape.ticks = ticks;
        axis.compositeShape.minorTicks = minorTicks;
        axis.compositeShape.location = location;

        if (axis.size.width == null && axis._orientation == Orientation.Vertical) {
            var maxSize = 0;

            for (var i = 0; i < ticks.length; i++) {
                var tick = ticks[i];
                var labelSize = axis._generateLabelSize(tick);
                maxSize = Math.max(labelSize.width, maxSize);
            }

            maxSize += axis.majorTickHeight + 4;

            axis._actualSize.width = maxSize;
        }

        if (axis.size.height == null && axis._orientation == Orientation.Horizontal) {
            axis._actualSize.height = axis.fontHeight + axis.majorTickHeight + 2;
        }

        var actualSize = axis._actualSize;

        axis.border.width = actualSize.width;
        axis.border.height = actualSize.height;
        axis.border.location = location;

        axis._isDirty = true;
    }

    NumericAxis._generateTicks = function (axis, range, size) {
        /// <summary>Generates ticks for specified axis.</summary>
        /// <param name="range" type="Range">Axis range.</param>
        /// <param name="size" type="Size">Axis size.</param>
        var result = TickCountChange.OK;
        var prevResult;
        var prevActualTickCount = -1;
        var ticksCount = TicksGenerator.defaultTicksCount;
        var iteration = 0;
        var ticks = null;
        var labelsLengths = null;

        range = range || new Range(0, 0, false);
        axis = axis || new NumericAxis(0, 0, 0, 0);

        var axisSize = axis.size;

        var ticksGenerator = axis.ticksGenerator;

        do {
            if (++iteration >= NumericAxis.maxTickArrangeIterations)
                throw "NumericAxis assertion failed.";

            if (range.isPoint())
                ticksCount = 1;

            var r = new Range(
                isFinite(range.min) ? range.min : 0,
                isFinite(range.max) ? range.max : 1);

            ticks = ticksGenerator.generateTicks(r, ticksCount);

            if (ticks.length == prevActualTickCount) {
                result = TickCountChange.OK;
                break;
            }

            prevActualTickCount = ticks.length;

            labelsSizes = axis._generateLabelsSizes(ticks);

            prevResult = result;

            result = axis._checkLabelsArrangement(axisSize, labelsSizes, ticks, range);

            if (prevResult == TickCountChange.Decrease && result == TickCountChange.Increase) {
                result = TickCountChange.OK;
            }
            if (result != TickCountChange.OK) {

                var prevTickCount = ticksCount;

                if (result == TickCountChange.Decrease)
                    ticksCount = ticksGenerator.decreaseTickCount(ticksCount);

                else {
                    ticksCount = ticksGenerator.increaseTicksCount(ticksCount);

                }
                if (ticksCount == 0 || prevTickCount == ticksCount) {
                    ticksCount = prevTickCount;
                    result = TickCountChange.OK;
                }
            }
        }

        while (result != TickCountChange.OK);

        return ticks;
    }

    p._checkLabelsArrangement = function (axisSize, labelsSizes, ticks, range) {
        /// <summary>Checks labels arrangement on axis.</summary>
        var isHorizontal = this._orientation == Orientation.Horizontal;

        var actualLabels = [];

        for (var i = 0; i < labelsSizes.length; i++) {
            if (labelsSizes[i] != null) {
                var actualLabel = {
                    label: labelsSizes[i],
                    tick: ticks[i]
                }
                actualLabels.push(actualLabel);
            }
        }

        var sizeInfos = [];

        for (var i = 0; i < actualLabels.length; i++) {
            var item = actualLabels[i];
            var x = this.getTickScreenCoordinate(item.tick, axisSize.width, axisSize.height, range);

            var size = isHorizontal ? item.label.width : item.label.height;

            var sizeInfo = {
                x: x,
                size: size
            };

            sizeInfos.push(sizeInfo);
        }

        sizeInfos.sort(function (obj1, obj2) {
            if (obj1.x < obj2.x)
                return -1;
            else if (obj1.x > obj2.x)
                return 1;
            return 0;
        });

        var res = TickCountChange.OK;

        for (var i = 0; i < sizeInfos.length - 1; i++) {
            if ((sizeInfos[i].x + sizeInfos[i].size * NumericAxis.decreaseRatio) > sizeInfos[i + 1].x) {
                res = TickCountChange.Decrease;
                return res;
            }
            if ((sizeInfos[i].x + sizeInfos[i].size * NumericAxis.increaseRatio) < sizeInfos[i + 1].x) {
                if (res != TickCountChange.Decrease)
                    res = TickCountChange.Increase;
            }
        }
        return res;
    }

    p._generateLabelsSizes = function (ticks) {
        /// <summary>Calculates sizes of axis labels ticks.</summary>
        if (this._ticksArr == ticks)
            return this._labelsSizesArr;
        else {

            var context = this.chartLayer.getContext();

            context.font = this.font;

            var labelsSizes = [];

            for (var i = 0; i < ticks.length; i++) {
                var tick = ticks[i];
                labelsSizes.push(this._generateLabelSizeInternal(tick.toString() + this._units, context));
            }

            this._ticksArr = ticks;
            this._labelsSizesArr = labelsSizes;

            return labelsSizes;
        }
    }

    p._generateLabelSize = function (tick, tickIndex) {
        /// <summary>Calculates size of axis label tick.</summary>
        var context = this.chartLayer.getContext();

        if (this._ticksArr != null) {
            var tickFromArr = this._ticksArr[tickIndex];
            if (tickFromArr != null && tickFromArr == tick) {
                return this._labelsSizesArr[tickIndex];
            }
            else {
                return this._generateLabelSizeInternal(tick.toString() + this._units, context);
            }
        }
        else {
            return this._generateLabelSizeInternal(tick.toString() + this._units, context);
        }
    }

    window.NumericAxis = NumericAxis;
}(window));
