/// <reference path="../common/size.js" />
/// <reference path="../core/renderableitem.js" />
/// <reference path="../common/point.js" />
/// <reference path="../core/commonrenderableitem.js" />
/// <reference path="../../utils/kinetic-v3.6.1.js" />
/// <reference path="../common/range.js" />
var TickCountChange = { "Increase": -1, "OK": 0, "Decrease": 1 };
var Orientation = { "Horizontal": 0, "Vertical": 1 };

(function (window) {
    var AxisBase = function (location, range, size, orientation) {
        /// <summary>New instance of base axis class.</summary>
        /// <param name="location" type="Point">NumericAxis left top location on renderer.</param>
        /// <param name="range" type="Range">NumericAxis visible range.</param>
        /// <param name="size" type="Size">NumericAxis size (width and height).</param>
        /// <param name="orientation" type="Number">NumericAxis orientation.</param>

        //Call base constructor.
        CommonRenderableItem.call(this);


        // Axis state properties.
        // Although, these properties are public (they don't have _), it is not recommended to modify them from outside of class or subclasses.
        // They must be used as as readonly properties.
        this.location = location;
        this.range = range;
        this.size = size;

        // Axis internal properties.
        // They must not be readen or modified.
        // There are special methods for their read/write operations.
        this._actualSize = new Size(size.width, size.height);
        this._isDirty = true;
        this._orientation = orientation;

        /******OPTIONS*******/
        this.font = "10pt Calibri";
        this.fontHeight = 15;
        this.foregroundColor = "black";
        this.backgroundColor = "yellow";
        this.majorTickHeight = 6;
        this.minorTickHeight = 3;
        this.drawBorder = true;
        /********************/

        this.compositeShape = new Kinetic.Shape({ drawFunc: function (){ } });
        this.border = new Kinetic.Shape({
            drawFunc: function () {
                var context = this.getContext();
                var axis = this.axis;
                var location = axis.location;
                context.strokeStyle = axis.foregroundColor;
                context.fillStyle = axis.backgroundColor;
                context.lineWidth = 1;

                var size = axis._actualSize;

                var roundX = MathHelper.optimizeValue(location.x);
                var roundY = MathHelper.optimizeValue(location.y);

                var roundWidth = MathHelper.optimizeValue(size.width);
                var roundHeight = MathHelper.optimizeValue(size.height);
                if (axis.drawBorder) {
                    context.strokeRect(roundX, roundY, roundWidth, roundHeight);
                }
                context.fillRect(roundX, roundY, roundWidth, roundHeight);
            }
        });

        this.compositeShape.axis = this;
        this.border.axis = this;
    }

    AxisBase.prototype = new CommonRenderableItem();

    var p = AxisBase.prototype;

    p.location = null;
    p.range = null;
    p.size = null;
    p._actualSize = null;
    p._orientation = null;

    p._ticksOnScreen = null;

    p.font = null;
    p.fontHeight = 15;
    p.foregroundColor = null;
    p.backgroundColor = null;
    p.majorTickHeight = null;
    p.minorTickHeight = null;
    p.drawBorder = null;

    p.chartLayer = null;

    p.compositeShape = null;
    p.border = null;

    p._attachBase = p.attach;

    p.attach = function (renderer) {
        /// <summary>Attaches axis to specified renderer.</summary>
        /// <param name="renderer" type="Renderer">Renderer to attach to.</param>
        this._attachBase(renderer);

        this.initializeFromElement(renderer.getContainer());

        var stage = renderer.getStage();
        var layer = stage.getLayer('chartLayer');
        this.chartLayer = layer;

        this.update(this.location, this.range, this.size);

        layer.add(this.border);
        layer.add(this.compositeShape);
    }

    p.initializeFromElement = function (element) {
        /// <summary>Initializes specified control from element's style.</summary>
        /// <param name="element" type="Element">Element to inilialize from.</param>

        var foregroundColor = element.getAttribute('data-axis-foreground-color');
        if (foregroundColor != undefined) {
            this.foregroundColor = foregroundColor;
        }

        var font = element.getAttribute('data-axis-font');
        if (font != undefined) {
            this.font = font;
        }

        var fontHeight = element.getAttribute('data-axis-font-height');
        if (fontHeight != undefined) {
            this.fontHeight = parseFloat(fontHeight);
        }

        var backgroundColor = element.getAttribute('data-axis-background-color');
        if (backgroundColor != undefined) {
            this.backgroundColor = backgroundColor;
        }

        var majorTickHeight = element.getAttribute('data-axis-major-tick-height');
        if (majorTickHeight != undefined) {
            this.majorTickHeight = parseFloat(majorTickHeight);
        }

        var minorTickHeight = element.getAttribute('data-axis-minor-tick-height');
        if (minorTickHeight != undefined) {
            this.minorTickHeight = parseFloat(minorTickHeight);
        }

        var drawBorder = element.getAttribute('data-axis-draw-border');
        if (drawBorder != undefined) {
            this.drawBorder = drawBorder == "true" ? true : false;
        }
    }

    p.update = function (location, range, size) {
        /// <summary>Updates axis state.</summary>
        /// <param name="location" type="Point">NumericAxis location.</param>
        /// <param name="range" type="Range">NumericAxis range.</param>
        /// <param name="size" type="Size">NumericAxis size.</param>
        this.location = location;
        this.range = range;
        this.size = size;
        this._actualSize = new Size(size.width, size.height);
    }

    p.getActualWidth = function () {
        /// <summary>Returns axis actual width.</summary>
        /// <returns type="Number" />
        return this._actualSize.width;
    }

    p.getActualHeight = function () {
        /// <summary>Returns axis actual height.</summary>
        /// <returns type="Number" />
        return this._actualSize.height;
    }

    p.getOrientation = function () {
        /// <summary>Returns axis orientation.</summary>
        /// <returns type="Number" />
        return this._orientation;
    }

    p._detachBase = p.detach;

    p.detach = function (renderer) {
        /// <summary>Detaches axis from renderer.</summary>
        /// <param name="renderer" type="Renderer">Renderer to detach from.</param>
        this._detachBase(renderer);
        var stage = renderer.getStage();
        var layer = stage.getLayer('chartLayer');
        layer.remove(this.compositeShape);
        layer.remove(this.border);
    }

    p.getDependantLayers = function () {
        /// <summary>Returns axis dependant layers.</summary>
        /// <returns type="Array" />
        return new Array("chartLayer");
    }

    p.getCoordinateFromTick = function (tick, screenWidth, screenHeight, range) {
        /// <summary>Returns tick's coordinate.</summary>
        if (this._orientation == Orientation.Horizontal)
            return CoordinateTransform.dataToScreenX(tick, range, screenWidth);
        else
            return CoordinateTransform.dataToScreenY(tick, range, screenHeight);
    }

    p.getScreenTicks = function () {
        return this._ticksOnScreen;
    }

    p._generateLabelSizeInternal = function (label, context) {
        /// <summary>Generates label's size for specified tick.</summary>
        /// <param name="label" type="String">Label to measure.</param>
        /// <param name="context" type="Context">Context to use.</param>
        context.font = this.font;

        var width = context.measureText(label).width;
        var height = this.fontHeight;

        var labelSize = new Size(width, height);

        return labelSize;
    }


    window.AxisBase = AxisBase;

}(window));
