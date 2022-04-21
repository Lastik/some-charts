/// <reference path="barscolorset.js" />
/// <reference path="../plotbase/plot.js" />
/// <reference path="../common/coordinatetransform.js" />
/// <reference path="../common/mathhelper.js" />
/// <reference path="../../utils/rgbcolor.js" />
/// <reference path="../common/datarect.js" />
/// <reference path="barsrenderedevent.js" />
/// <reference path="../common/eventtarget.js" />

(function (window) {

    var BarsPlot = function () {
        /// <summary>Creates bars plot, which is used to display bars on chart.</summary>

        Plot.call(this);

        this._innerShape.plot = this;
        this._innerShape.drawFunc = function () {
            var self = this.plot;

            var screen = self._screen;
            var screenLocaton = screen.getMinXMinY();
            var screenSize = screen.getSize();

            var context = this.getContext();

            /**Clipping*/
            context.save();
            context.beginPath();
            context.rect(screenLocaton.x + 0.5, screenLocaton.y + 0.5, screenSize.width - 0.5, screenSize.height - 0.5);
            context.clip();
            /**********/

            var dataSeriesCollection = self._dataSeriesCollection;

            var zero = CoordinateTransform.dataToScreenRegionXY(new NumericPoint(0, 0), self._visible, screen);
            var zeroY = zero.y;

            var prevSeries = null;
            var prevTransformedPts;

            var minY = zero.y;

            var transformedPtsArr = [];
            var widths = [];

            for (var ind = 0; ind < dataSeriesCollection.length; ind++) {
                var dataSeries = dataSeriesCollection[ind];
                var dataSource = dataSeries.data;
                var transformedPts = [];
                var w = self._calculateBarsWidth(transformedPts, ind);
                widths.push(w);
                transformedPtsArr.push(transformedPts);
                for (var i = 0; i < dataSource.length; i++) {
                    minY = Math.min(minY, transformedPts[i].y);
                }
            }

            var singlePointSeriesCollection = true;
            for(var i = 0; i < dataSeriesCollection.length; i++)
            {
                if(dataSeriesCollection[i].data.length != 1)
                {
                    singlePointSeriesCollection = false;
                    break;
                }
            }

            for (var ind = dataSeriesCollection.length - 1; ind >= 0 ; ind--) {
                var dataSeries = dataSeriesCollection[ind];
                var dataSource = dataSeries.data;

                var verticalRange = self._visible.getVerticalRange();
                verticalRange.y += screenLocaton.y;

                var transformedPts = transformedPtsArr[ind];
                var prevTransformedPts = null;
                if (ind != 0) {
                    prevTransformedPts = transformedPtsArr[ind - 1];
                }

                var w = widths[ind];

                var barRenderWidthPlusMargin = w;

                if (singlePointSeriesCollection) {
                    w *= 0.45;
                }
                else {
                    w *= 0.7;
                }


                var colorSet = null;

                if (dataSeries.__3109a40634724206b105b25395ff9857 == undefined) {
                    var colorSet = self._calculateBarsColors(dataSeries.color);
                    dataSeries.__3109a40634724206b105b25395ff9857 = colorSet;
                }
                else {
                    colorSet = dataSeries.__3109a40634724206b105b25395ff9857;
                }
                var gradient = context.createLinearGradient(screenLocaton.x, minY, screenLocaton.x, zero.y);
                gradient.addColorStop(0, colorSet.fill1);
                gradient.addColorStop(0.4, colorSet.fill1);
                gradient.addColorStop(1, colorSet.fill2);
                context.fillStyle = gradient;

                context.strokeStyle = colorSet.stroke;

                context.lineWidth = 1;

                var barsRenderLeftX = null;

                if (dataSource.length > 0) {
                    var first = transformedPts[0];

                    var minX = first.x - barRenderWidthPlusMargin / 2;
                    barsRenderLeftX = minX;
                }

                self._barsRenderLeftOffset = barsRenderLeftX;
                self._barsRenderWidth = barRenderWidthPlusMargin;

                self.eventTarget.fire(new BarsRenderedEvent(barsRenderLeftX, barRenderWidthPlusMargin));

                var zeroYOptimized = MathHelper.optimizeValue(zeroY);

                for (var i = 0; i < dataSource.length; i++) {

                    var rectX = null;
                    var rectY = null;
                    var rectW = null;
                    var rectH = null;

                    if (ind == 0) {
                        var pointLocation = transformedPts[i];

                        var h = pointLocation.y - zeroY;

                        var xOptimized = MathHelper.optimizeValue(pointLocation.x - w / 2);

                        rectX = xOptimized;
                        rectY = zeroYOptimized;
                        rectW = MathHelper.optimizeValue(w);
                        rectH = MathHelper.optimizeValue(h);
                    }
                    else {
                        var pointLocation = transformedPts[i];
                        var prevPointLocation = prevTransformedPts[i];

                        var h = pointLocation.y - zeroY;

                        var y = null;

                        if (h < 0) {
                            y = Math.min(prevPointLocation.y + 2, zeroY);
                        }
                        else if (h > 0) {
                            y = Math.max(prevPointLocation.y - 2, zeroY);
                        }
                        else {
                            y = zeroY;
                        }

                        rectX = MathHelper.optimizeValue(pointLocation.x - w / 2);
                        rectY = MathHelper.optimizeValue(y);
                        rectW = MathHelper.optimizeValue(w);
                        rectH = MathHelper.optimizeValue(pointLocation.y - prevPointLocation.y);
                    }

                    if (rectH != 0) {
                        context.beginPath();
                        context.rect(rectX, rectY, rectW, rectH);
                        context.closePath();
                        context.fill()
                        context.stroke();

                        if (self._drawValueOnBars) {
                            context.save();

                            context.beginPath();
                            context.rect(rectX, rectY, rectW, rectH);
                            context.clip();

                            context.fillStyle = self._labelsForeground;
                            context.font = self._labelsFont;

                            var value = parseFloat(dataSource[i].y.toFixed(self._labelsPrecision)).toString();
                            var labelText = value + self._units;

                            var textWidth = context.measureText(labelText).width;

                            var pointLocation = transformedPts[i];

                            var x = pointLocation.x - textWidth / 2;
                            var h = pointLocation.y - zeroY;

                            var textH = null;
                            if (self._labelsFontCalculatedTextHeightFor != self._labelsFont) {
                                self._labelsFontCalculatedTextHeight = MathHelper.calculateTextHeight(context, self._labelsFont);
                                self._labelsFontCalculatedTextHeightFor = self._labelsFont;
                            }

                            textH = self._labelsFontCalculatedTextHeight;

                            var y = zeroY + h + textH + 2;
                            context.fillText(labelText, x, y);
                            context.restore();
                        }
                    }
                }
            }
            /**Clipping*/
            context.restore();
            /***********/
        };

        this.eventTarget = new EventTarget();
    }

    BarsPlot.prototype = new Plot();

    var p = BarsPlot.prototype;

    p._barsFill = null;

    p._barsFill1 = null;
    p._barsFill2 = null;
    p._barsStroke = null;

    p._drawValueOnBars = false;
    p._units = "";
    p._labelsFont = "10pt Calibri";
    p._labelsForeground = "black";
    p._labelsPrecision = 2;

    p._labelsFontCalculatedTextHeight = null;
    p._labelsFontCalculatedTextHeightFor = null;

    p._darkerStroke = false;

    p.eventTarget = null;

    window.BarsPlot = BarsPlot;

    p.getBoundingRectangleInternal = p.getBoundingRectangle;

    p._barsRenderLeftOffset = null;
    p._barsRenderWidth = null;

    p._calculateBarsColors = function (fill) {
        /// <summary>Calculates bars color set based on single fill color.</summary>
        /// <param name="fill" type="String">String representation of color.</param>
        var barsFill = fill;
        var barsFill2 = fill;
        var fillColor = new RGBColor(fill);
        var fillColor1 = fillColor;

        var maxValue = Math.max(Math.max(fillColor1.r, fillColor1.g), fillColor1.b);
        var offset = maxValue * 0.3;

        fillColor1.r += offset;
        fillColor1.g += offset;
        fillColor1.b += offset;

        fillColor1.r = Math.min(Math.round(fillColor1.r), 255);
        fillColor1.g = Math.min(Math.round(fillColor1.g), 255);
        fillColor1.b = Math.min(Math.round(fillColor1.b), 255);

        var barsFill1 = fillColor1.toHex();

        var strokeColor = fillColor;

        if (!this._darkerStroke)
            offset = -maxValue * 0.2;
        else
            offset = -maxValue * 0.78;

        strokeColor.r += offset;
        strokeColor.g += offset;
        strokeColor.b += offset;

        strokeColor.r = Math.min(Math.round(strokeColor.r), 255);
        strokeColor.g = Math.min(Math.round(strokeColor.g), 255);
        strokeColor.b = Math.min(Math.round(strokeColor.b), 255);

        var barsStroke = strokeColor.toHex();

        return new BarsColorSet(barsFill1, barsFill2, barsStroke);
    }

    p.getBoundingRectangle = function () {
        /// <summary>Calculates bounding rectangle of specified plot.</summary>
        /// <returns type="DataRect" />
        var rect = this.getBoundingRectangleInternal();

        var transformedPts = [];
        var minDelta = Number.MAX_VALUE;
        for (var i = 0; i < this._dataSeriesCollection.length; i++) {
            minDelta = Math.min(minDelta, this._calculateBarsWidth(transformedPts, i));
        }
        var visibleHorizontalRange = this._visible.getHorizontalRange();
        var w = CoordinateTransform.screenToDataX(minDelta, visibleHorizontalRange, this._screen.getHorizontalRange().getLength()) - visibleHorizontalRange.min;

        rect = new DataRect(rect.minX - w / 2, rect.minY, rect.width + w, rect.height);
        //Merge zero y coord with bounding rect.
        rect = rect.merge(new DataRect(rect.minX, 0, rect.width, 0));
        return rect;
    }

    p.getBarsRenderLeftOffset = function () {
        /// <summary>Returns offset from left corner of renderer (in pixels), with which bars rendered last time.</summary>
        /// <returns type="Number" />
        return this._barsRenderLeftOffset;
    }

    p.getBarsRenderedWidth = function () {
        /// <summary>Returns bars width (in pixels), with which bars rendered last time. </summary>
        /// <returns type="Number" />
        return this._barsRenderWidth;
    }

    p._calculateBarsWidth = function (transformedPts, seriesIndex) {
        /// <summary>Canculates bars width and fills transformed points array.</summary>
        /// <param name="transformedPts" type="Array">Array to fill with transformed points.</param>
        /// <param name="seriesIndex" type="Number">Index of series in collection.</param>
        /// <returns type="Number" />

        var minDelta = Number.MAX_VALUE;

        var dataSeries = this._dataSeriesCollection[seriesIndex];

        var dataSource = dataSeries.data;
        for (var i = 0; i < dataSource.length; i++) {
            var pt = CoordinateTransform.dataToScreenRegionXY(dataSource[i], this._visible, this._screen);
            transformedPts.push(pt);

            if (i != 0) {
                var delta = pt.x - transformedPts[i - 1].x;
                if (delta < minDelta) {
                    minDelta = delta;
                }
            }
        }

        if (transformedPts.length == 1) {
            var ptMin = CoordinateTransform.dataToScreenRegionXY(this._visible.getMinXMinY(), this._visible, this._screen);
            var ptMax = CoordinateTransform.dataToScreenRegionXY(this._visible.getMaxXMaxY(), this._visible, this._screen);
            minDelta = ptMax.x - ptMin.x;
        }

        return minDelta;
    }

    p.__attachBase = p.attach;

    p.attach = function (renderer) {
        p.__attachBase.call(this, renderer);

        var element = renderer.getContainer();

        var darkerBorders = element.getAttribute('data-plot-use-darker-border');
        if (darkerBorders != undefined) {
            var darkerBordersBoolean = darkerBorders == 'true' ? true : false;
            this._darkerStroke = darkerBordersBoolean;
        }

        var drawLabelsOnBars = element.getAttribute('data-bar-draw-labels-on-bars');
        if (drawLabelsOnBars != undefined) {
            var drawLabelsOnBarsBoolean = drawLabelsOnBars == 'true' ? true : false;
            this.setDrawLabelsLabels(true);
        }

        var labelsFont = element.getAttribute('data-bar-labels-font');
        if (labelsFont != undefined) {
            this._labelsFont = labelsFont;
            this._isDirty = true;
        }

        var labelsForeground = element.getAttribute('data-bar-labels-foreground');
        if (labelsForeground != undefined) {
            this._labelsForeground = labelsForeground;
            this._isDirty = true;
        }

        var labelsPrecision = element.getAttribute('data-bar-labels-precision');
        if (labelsPrecision != undefined) {
            this._labelsPrecision = labelsPrecision;
            this._isDirty = true;
        }
    }

    p.setUnits = function (newUnits, addDelimiter) {
        /// <summary>Sets plot's units.</summary>
        /// <param name="newUnits" type="String">Plot's new units.</param>
        if (!addDelimiter)
            this._units = newUnits;
        else
            this._units = ' ' + newUnits;
        this._isDirty = true;
    }

    p.setDrawLabelsLabels = function (drawLabels) {
        /// <summary>Sets vakue, which indicates, whether to draw values labels, or not.</summary>
        /// <param name="drawLabels" type="Boolean">True, if labels on bars must be drawn with values. Otherwise, returns false.</param>
        this._drawValueOnBars = drawLabels;
        this._isDirty = true;
    }

}(window));
