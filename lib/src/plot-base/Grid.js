/// <reference path="../../Utils/kinetic-v3.5.js" />
/// <reference path="../../Utils/excanvas.js" />
/// <reference path="../Core/Renderer.js" />
/// <reference path="../Core/ChartContent.js" />
/// <reference path="TicksGenerator.js" />
/// <reference path="../Common/Range.js" />
/// <reference path="../Common/DataTransform.js" />
/// <reference path="../Common/Size.js" />
/// <reference path="../common/mathhelper.js" />
/// <reference path="../Common/Point.js" />
/// <reference path="NumericAxis.js" />

(function (window) {

    var Grid = function (location, size, horizontalTicks, verticalTicks) {
        /// <summary>Creates new instance of grid. Grid is grid net on chart's plot area.</summary>
        /// <param name="location" type="Point">Grid location on renderer.</param>
        /// <param name="size" type="Size">Grid size.</param>
        /// <param name="horizontalTicks" type="Array">Array of grid horizontal ticks.</param>
        /// <param name="verticalTicks" type="Array">Array of grid vertical ticks.</param>
        RenderableItem.call(this);

        /******OPTIONS*******/
        this.foregroundColor = "black";
        this.backgroundColor = "white";
        /********************/

        this._horizontalTicks = horizontalTicks;
        this._verticalTicks = verticalTicks;

        this.location = location;
        this.size = size;

        this.compositeShape = new Kinetic.Shape({
            drawFunc: function () {
                var context = this.getContext();
                var grid = this.grid;

                var horizontalTicks = grid._horizontalTicks;
                var verticalTicks = grid._verticalTicks;
                var location = grid.location;
                var size = grid.size;

                var width = size.width;
                var height = size.height;

                context.save();
                context.beginPath();
                context.rect(location.x, location.y, width, height);
                context.clip();

                context.lineWidth = 0.5;
                context.strokeStyle = grid.foregroundColor;

                if (horizontalTicks != null) {
                    for (var i = 0; i < horizontalTicks.length; i++) {
                        var tick = horizontalTicks[i];

                        var start = new NumericPoint(
                        MathHelper.optimizeValue(location.x),
                        MathHelper.optimizeValue(location.y + tick));

                        var stop = new NumericPoint(
                        MathHelper.optimizeValue(location.x + size.width),
                        MathHelper.optimizeValue(location.y + tick));

                        context.moveTo(start.x, start.y);
                        context.lineTo(stop.x, stop.y);
                    }
                }

                if (verticalTicks != null) {
                    for (var i = 0; i < verticalTicks.length; i++) {
                        var tick = verticalTicks[i];

                        var start = new NumericPoint(
                        MathHelper.optimizeValue(location.x + tick),
                        MathHelper.optimizeValue(location.y));

                        var stop = new NumericPoint(
                        MathHelper.optimizeValue(location.x + tick),
                        MathHelper.optimizeValue(location.y + size.height));

                        context.moveTo(start.x, start.y);
                        context.lineTo(stop.x, stop.y);
                    }
                }

                context.stroke();

                context.restore();
            }
        });

        this.border = new Kinetic.Shape({
            drawFunc: function () {
                var context = this.getContext();
                var grid = this.grid;
                var location = grid.location;
                var size = grid.size;
                context.strokeStyle = grid.foregroundColor;
                context.fillStyle = grid.backgroundColor;
                context.lineWidth = 1;
                context.strokeRect(location.x, location.y, size.width, size.height);
                context.fillRect(location.x, location.y, size.width, size.height);
            }
        });

        this.compositeShape.grid = this;
        this.border.grid = this;
    }

    Grid.prototype = new RenderableItem();

    var p = Grid.prototype;

    p.foregroundColor = null;
    p.backgroundColor = null;

    p._horizontalTicks = null;
    p._verticalTicks = null;

    p.size = null;
    p.location = null;
    p._isDirty = false;

    p.update = function (location, size, horizontalTicks, verticalTicks) {
        /// <summary>Uprates grid's state.</summary>
        /// <param name="location" type="Point">Grid location on renderer.</param>
        /// <param name="size" type="Size">Grid size.</param>
        /// <param name="horizontalTicks" type="Array">Array of grid horizontal ticks.</param>
        /// <param name="verticalTicks" type="Array">Array of grid vertical ticks.</param>
        this.location = location;
        this.size = size;

        this._horizontalTicks = horizontalTicks;
        this._verticalTicks = verticalTicks;

        this._isDirty = true;
    }

    p.attachBase = p.attach;

    p.attach = function (renderer) {
        this.attachBase(renderer);
        var stage = renderer.getStage();
        var layer = stage.getLayer('chartLayer');
        layer.add(this.border);
        layer.add(this.compositeShape);

        this.initializeFromElement(renderer.getContainer());
    }

    p.initializeFromElement = function (element) {
        /// <summary>Initializes specified control from element's style.</summary>
        /// <param name="element" type="Element">Element to inilialize from.</param>

        var foregroundColor = element.getAttribute('data-grid-foreground-color');
        if (foregroundColor != undefined) {
            this.foregroundColor = foregroundColor;
        }

        var backgroundColor = element.getAttribute('data-grid-background-color');
        if (backgroundColor != undefined) {
            this.backgroundColor = backgroundColor;
        }
    }

    p.detachBase = p.detach;
    p.detach = function (renderer) {
        this.detachBase(renderer);
        var stage = renderer.getStage();
        var layer = stage.getLayer('chartLayer');
        layer.remove(this.compositeShape);
        layer.remove(this.border);
    }

    p.hasDirtyLayers = function () {
        return this._isDirty;
    }

    p.markDirty = function () {
        this._isDirty = false;
    }

    p.getDirtyLayers = function () {
        if (this._isDirty)
            return new Array("chartLayer");
        else
            return null;
    }

    p.getDependantLayers = function () {
        return new Array("chartLayer");
    }

    p.getSize = function () {
        /// <summary>Returns size of this grid.</summary>
        /// <returns type="Size" />
        return this.size;
    }

    window.Grid = Grid;
}(window));
