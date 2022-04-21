/// <reference path="../common/size.js" />
/// <reference path="../common/point.js" />
/// <reference path="../common/size.js" />
/// <reference path="../core/renderableitem.js" />
/// <reference path="../../utils/kinetic-v3.6.1.js" />
/// <reference path="../common/datarect.js" />
/// <reference path="../common/range.js" />
/// <reference path="../../utils/rx.jquery.js" />
/// <reference path="../common/mathhelper.js" />
/// <reference path="../../utils/rx.js" />
/// <reference path="../core/commonrenderableitem.js" />
/// <reference path="../../utils/linq.min.js" />
/// <reference path="../common/keyvaluepair.js" />
/// <reference path="../common/datapoint.js" />
/// <reference path="../common/eventtarget.js" />
/// <reference path="../../utils/linq.min.js" />
/// <reference path="../common/stringdatapoint.js" />

var HorizontalAlignment = { "Left": 0, "Center": 1};

(function (window) {

    var RenderedLabel = function (text, font, location, width, textAlignment) {
        /// <summary>Creates label, rendered on canvas.</summary>
        /// <param name="location" type="Point">label's location</param>
        /// <param name="width" type="Number">Label's width.</param>
        /// <param name="textAlignment" type="Number">Text horizontal alignment.</param>
        CommonRenderableItem.call(this);

        this._shape = new Kinetic.Shape({
            drawFunc: function () {
                var context = this.getContext();
                var label = this.label;
                context.fillStyle = label.foregroundColor;
                context.font = label._font;

                var location = label.location;

                context.measureText(label.text).width;

                var x = location.x;
                var y = location.y;

                if (label.textAlignment == HorizontalAlignment.Center) {
                    x += label.width / 2 - label._textSize.width / 2;
                }

                y += label._textSize.height / 2 + label._textOffset;

                context.fillText(label._text, x, y);
            }
        });

        this._shape.label = this;

        this.location = location;
        this.width = width;
        this.textAlignment = textAlignment;

        this._text = text;
        this._font = font;

        this._dependantLayers = new Array("labelsLayer");

        this._updateTextSizeAndOffset();
    }

    RenderedLabel.prototype = new CommonRenderableItem();

    var p = RenderedLabel.prototype;

    p.foregroundColor = "black";

    p.location = null;
    p.width = null;
    p.textAlignment = null;

    p._text = "";
    p._font = "10pt Calibri";
    p._textSize = null;
    p._textOffset = null;

    p._layer = null;
    p._shape = null;

    p._dependantLayers = null;

    p.setText = function (newText) {
        /// <summary>Updates label's text.</summary>
        /// <param name="newText" type="String">Label's new text.</param>
        if (this._text != newText) {
            this._text = newText;
            this._updateTextSizeAndOffset();
            this._isDirty = true;
        }
    }

    p._updateTextSizeAndOffset = function () {
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        context.font = this._font;
        var w = context.measureText(this._text).width;
        var h = MathHelper.calculateTextHeight(context, this._font);
        this._textSize = new Size(w, h);
        this._textOffset = MathHelper.calculateTextVerticalOffsetHeight(context, this._font);
    }

    p.getActualHeight = function () {
        /// <summary>Returns actual height of label.</summary>
        /// <returns type="Number" />
        return this._textSize.height;
    }

    p._attachBase = p.attach;
    p.attach = function (renderer) {
        this._attachBase(renderer);

        var stage = renderer.getStage();
        var layer = stage.getLayer("labelsLayer");
        this._layer = layer;

        layer.add(this._shape);
    }

    p._detachBase = p.detach;
    p.detach = function (renderer) {
        this._detachBase(renderer);

        var stage = renderer.getStage();
        var layer = stage.getLayer("labelsLayer");
        this._layer = null;

        layer.remove(this._shape);
    }

    p.getDependantLayers = function () {
        return this._dependantLayers;
    }

    window.RenderedLabel = RenderedLabel;

}(window));
