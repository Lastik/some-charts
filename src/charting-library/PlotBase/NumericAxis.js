/// <reference path="../common/utilities.js" />
/// <reference path="../../Utils/kinetic-v3.5.js" />
/// <reference path="../../Utils/excanvas.js" />
/// <reference path="../Core/Renderer.js" />
/// <reference path="axisbase.js" />
/// <reference path="../Core/RenderableItem.js" />
/// <reference path="TicksGenerator.js" />
/// <reference path="../Common/Range.js" />
/// <reference path="../common/utilities.js" />
/// <reference path="../Common/Size.js" />
/// <reference path="../Common/Point.js" />
/// <reference path="../common/mathhelper.js" />
/// <reference path="../Common/CoordinateTransform.js" />
/// <reference path="../core/renderer.js" />
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
            var ticks = this.ticks;
            var minorTicks = this.minorTicks;
            var axis = this.axis;

            var ticksCount = this.ticks.length;
            var minorTicksCount = this.minorTicks.length;

            var ticksOnScreen = axis._ticksOnScreen;
            var minorTicksOnScreen = axis._minorTicksOnScreen;

            var size = axis._actualSize;

            var width = size.width;
            var height = size.height;

            var range = axis.range;

            var context = this.getContext();

            var location = this.location;

            var roundX = MathHelper.optimizeValue(location.x);
            var roundY = MathHelper.optimizeValue(location.y);

            var roundWidth = MathHelper.optimizeValue(size.width);
            var roundHeight = MathHelper.optimizeValue(size.height);

            context.save();
            context.beginPath();
            context.rect(roundX, roundY, roundWidth, roundHeight);
            context.clip();

            context.font = axis.font;
            context.fillStyle = axis.foreground;
            context.textBaseline = "top";

            context.beginPath();
            context.lineWidth = 1;

            context.strokeStyle = axis.foreground;

            if (axis._orientation == Orientation.Horizontal) {

                for (var i = 0; i < ticksCount; i++) {
                    var tick = ticks[i];

                    var tickOnScreen = ticksOnScreen[i];
                    var labelSize = axis._generateLabelSize(tick, i);

                    context.fillText(tick.toString(),
                    location.x + tickOnScreen - labelSize.width / 2,
                    location.y + axis.tickHeight - labelSize.height * Utilities.TextVerticalOffsetMultiplier);

                    var xVal = MathHelper.optimizeValue(location.x + tickOnScreen);
                    var yVal = MathHelper.optimizeValue(location.y);
                    context.moveTo(xVal, yVal);
                    yVal = MathHelper.optimizeValue(location.y + axis.tickHeight);
                    context.lineTo(xVal, yVal);
                }

                //Place minor ticks

                for (var i = 0; i < minorTicksCount; i++) {
                    var minorTick = minorTicks[i];
                    var minorTickOnScreen = minorTicksOnScreen[i]

                    var xVal = MathHelper.optimizeValue(location.x + minorTickOnScreen);
                    var yVal = MathHelper.optimizeValue(location.y);
                    context.moveTo(xVal, yVal);
                    yVal = MathHelper.optimizeValue(location.y + axis.minorTickHeight);
                    context.lineTo(xVal, yVal);
                }
            }
            else {

                var labelVerticalDelimiter = 2 - 2 * Utilities.TextVerticalOffsetMultiplier;

                for (var i = 0; i < ticksCount; i++) {
                    var tick = ticks[i];

                    var tickOnScreen = ticksOnScreen[i];
                    var labelSize = axis._generateLabelSize(tick);

                    context.fillText(tick.toString() + axis._units, location.x + width - labelSize.width - (axis.tickHeight + 2), location.y + tickOnScreen - labelSize.height / labelVerticalDelimiter);

                    var xVal = MathHelper.optimizeValue(location.x + width - axis.tickHeight);
                    var yVal = MathHelper.optimizeValue(location.y + tickOnScreen);
                    context.moveTo(xVal, yVal);
                    xVal = MathHelper.optimizeValue(location.x + width);
                    context.lineTo(xVal, yVal);
                }

                //Place minor ticks

                for (var i = 0; i < minorTicksCount; i++) {
                    var minorTick = minorTicks[i];
                    var minorTickOnScreen = minorTicksOnScreen[i];

                    var xVal = MathHelper.optimizeValue(location.x + width - axis.minorTickHeight);
                    var yVal = MathHelper.optimizeValue(location.y + minorTickOnScreen);
                    context.moveTo(xVal, yVal);
                    xVal = MathHelper.optimizeValue(location.x + width);
                    context.lineTo(xVal, yVal);
                }
            }
            context.stroke();
            context.restore();
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

            maxSize += axis.tickHeight + 4;

            axis._actualSize.width = maxSize;
        }

        if (axis.size.height == null && axis._orientation == Orientation.Horizontal) {
            axis._actualSize.height = axis.fontHeight + axis.tickHeight + 2;
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
            var x = this.getCoordinateFromTick(item.tick, axisSize.width, axisSize.height, range);

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
