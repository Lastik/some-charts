/// <reference path="../../Utils/kinetic-v3.5.js" />
/// <reference path="../../Utils/excanvas.js" />
/// <reference path="../Core/Renderer.js" />
/// <reference path="axisbase.js" />
/// <reference path="../Core/RenderableItem.js" />
/// <reference path="TicksGenerator.js" />
/// <reference path="../Common/Range.js" />
/// <reference path="../Common/Size.js" />
/// <reference path="../Common/Point.js" />
/// <reference path="../common/mathhelper.js" />
/// <reference path="../Common/CoordinateTransform.js" />
/// <reference path="../core/renderer.js" />
(function (window) {

    var StringAxis = function (location, range, size, orientation, labels) {
        /// <summary>Axis with string labels on it.</summary>
        /// <param name="location" type="Point">Axis location.</param>
        /// <param name="range" type="Range">Axis range (it's min and max values).</param>
        /// <param name="size" type="Size">Axis size.</param>
        /// <param name="orientation" type="Number">Axis orientation.</param>
        /// <param name="labels" type="Array">Labels on axis.</param>
        AxisBase.call(this, location, range, size, orientation);

        this._labels = labels;
        this._prevLabels = null;

        this._ticksOnScreen = null;

        this.compositeShape.drawFunc = function () {

            var axis = this.axis;
            var location = axis.location;

            var size = axis._actualSize;

            var width = size.width;
            var height = size.height;

            var range = axis.range;

            var context = this.getContext();

            var location = axis.location;

            var ticksOnScreen = axis._ticksOnScreen;

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

            var labels = axis._labels;

            if (labels != null) {
                if (axis._orientation == Orientation.Horizontal) {

                    for (var i = 0; i < labels.length; i++) {
                        var label = labels[i];

                        var tickOnScreen = ticksOnScreen[i];
                        var labelSize = axis._generateLabelSize(label, i);

                        if (i != labels.length - 1) {
                            var nextTickOnScreen = ticksOnScreen[i + 1];
                            var betweenTicksX = location.x + (tickOnScreen + nextTickOnScreen) / 2;

                            var xVal = MathHelper.optimizeValue(betweenTicksX);
                            var yVal = MathHelper.optimizeValue(location.y);
                            context.moveTo(xVal, yVal);
                            yVal = MathHelper.optimizeValue(location.y + axis.tickHeight + StringAxis._tickIncreaseConst);
                            context.lineTo(xVal, yVal);

                            //If zoom is so large, that axis labels overlap
                            if (location.x + tickOnScreen + labelSize.width / 2 > betweenTicksX) {
                                context.fillStyle = axis.background;

                                var size = axis._actualSize;

                                var roundX = MathHelper.optimizeValue(location.x + tickOnScreen - labelSize.width / 2);
                                var roundY = MathHelper.optimizeValue(location.y);

                                var roundWidth = MathHelper.optimizeValue(labelSize.width);
                                var roundHeight = MathHelper.optimizeValue(labelSize.height);

                                context.fillRect(roundX, roundY, roundWidth, roundHeight);

                                context.fillStyle = axis.foreground;
                            }
                        }
                        else if (i != 0) {
                            var prevTickOnScreen = ticksOnScreen[i - 1];
                            var betweenTicksX = location.x + (tickOnScreen + prevTickOnScreen) / 2;

                            //If zoom is so large, that axis labels overlap
                            if (location.x + tickOnScreen - labelSize.width / 2 < betweenTicksX) {
                                context.fillStyle = axis.background

                                var size = axis._actualSize;

                                var roundX = MathHelper.optimizeValue(location.x + tickOnScreen - labelSize.width / 2);
                                var roundY = MathHelper.optimizeValue(location.y);

                                var roundWidth = MathHelper.optimizeValue(labelSize.width);
                                var roundHeight = MathHelper.optimizeValue(labelSize.height);

                                context.fillRect(roundX, roundY, roundWidth, roundHeight);

                                context.fillStyle = axis.foreground;
                            }
                        }

                        context.fillText(label.key,
                        location.x + tickOnScreen - labelSize.width / 2,
                        location.y - labelSize.height * Utilities.TextVerticalOffsetMultiplier + StringAxis._verticalMargin);
                    }
                }
                else {
                    throw 'Not implemented';
                }
            }
            context.stroke();
            context.restore();
        };
    }

    StringAxis.prototype = new AxisBase(new NumericPoint(0, 0), new Range(0, 0, false), new Size(0, 0), Orientation.Horizontal);

    var p = StringAxis.prototype;

    p._labelsSizesArr = null;
    p._labels = null;
    p._prevLabels = null;

    StringAxis._verticalMargin = 2;
    StringAxis._tickIncreaseConst = 2;

    p._gridTicks = [];

    p._updateBase = p.update;
    p.update = function (location, range, size) {
        this._updateBase(location, range, size);
        StringAxis._updateInternal(this, location, range, size);
    }

    p.setLabels = function (labels) {
        /// <summary>Updates axis labels.</summary>
        /// <param name="labels" type="Array">New labels array.</param>
        this._labels = labels;
        this._isDirty = true;
    }

    StringAxis._updateInternal = function (axis, location, range, size) {
        axis._labelsSizesArr = null;
        axis._ticksOnScreen = [];

        var labels = axis._labels;

        if (labels != null) {

            for (var i = 0; i < labels.length; i++) {
                var label = labels[i];
                var value = label.value;
                axis._ticksOnScreen.push(axis.getCoordinateFromTick(value, size.width, size.height, range));
            }
        }

        if (axis.size.width == null && axis._orientation == Orientation.Vertical) {
            var maxSize = 0;

            if (labels != null) {
                for (var i = 0; i < labels.length; i++) {
                    var label = labels[i];
                    var labelSize = axis._generateLabelSize(label);
                    maxSize = Math.max(labelSize.width, maxSize);
                }
            }

            axis._actualSize.width = maxSize;
        }

        if (axis.size.height == null && axis._orientation == Orientation.Horizontal) {
            if (labels != null) {
                var maxHeight = Math.max(axis.fontHeight, axis.tickHeight + StringAxis._tickIncreaseConst);
                axis._actualSize.height = maxHeight + StringAxis._verticalMargin;
            }
            else {
                axis._actualSize.height = 0;
            }
        }

        axis._isDirty = true;
    }

    p.getScreenTicks = function () {
        return this.gridTicks;
    }

    p._generateLabelsSizes = function (labels) {
        if (this._prevLabels == this._labels) {
            return this._labelsSizesArr;
        }
        else {
            var context = this.chartLayer.getContext();
            context.font = this.font;

            this._labelsSizesArr = [];
            for (var i = 0; i < this._labels.length; i++) {
                var label = this._labels[i];
                this.labelsSizesArr.push(this._generateLabelSizeInternal(label.key, context));
            }
            this._prevLabels = this._labels;
            return this._labelsSizesArr;
        }
    }

    p._generateLabelSize = function (label, index) {
        var context = this.chartLayer.getContext();

        if (this._labelsSizesArr != null) {
            var labelFromArr = this._labels[index];
            if (labelFromArr != null && labelFromArr == label) {
                return this._labelsSizesArr[index];
            }
            else {
                return this._generateLabelSizeInternal(label.key, context);
            }
        }
        else {
            return this._generateLabelSizeInternal(label.key, context);
        }
    }

    window.StringAxis = StringAxis;
}(window));
