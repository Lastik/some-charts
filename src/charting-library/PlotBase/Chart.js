/// <reference path="../../utils/kineticextensions.js" />
/// <reference path="../Common/EventTarget.js" />
/// <reference path="../../Utils/kinetic-v3.5.js" />
/// <reference path="../../Utils/excanvas.js" />
/// <reference path="../Core/Renderer.js" />
/// <reference path="../Core/RenderableItem.js" />
/// <reference path="TicksGenerator.js" />
/// <reference path="../Common/Range.js" />
/// <reference path="../Common/DataRect.js" />
/// <reference path="../Common/DataTransform.js" />
/// <reference path="../Common/Size.js" />
/// <reference path="../Common/Point.js" />
/// <reference path="../Common/DragEvent.js" />
/// <reference path="../Common/EventBase.js" />
/// <reference path="../../utils/kinetic-v3.7.2.js" />
/// <reference path="plot.js" />
/// <reference path="NumericAxis.js" />
/// <reference path="stringaxis.js" />
/// <reference path="axistypes.js" />
/// <reference path="renderedlabel.js" />
/// <reference path="../../utils/linq.min.js" />

(function (window) {

    var Chart = function (location, size, dataRect, horizontalAxisType, enableNavigation) {
        /// <summary>Creates new instance of chart.</summary>
        /// <param name="location" type="Point">Chart's location relative to left up corner of canvas.</param>
        /// <param name="size" type="Size">Chart's size.</param>
        /// <param name="dataRect" type="DataRect">Currently visible rectangle on chart.</param>
        /// <param name="horizontalAxisType" type="Number">Type of horizontal axis.</param>
        /// <param name="enableNavigation" type="Boolean">Optional parameter, which indicates, whether chart navigation is enabled. Default value is true.</param>
        this._location = location;
        this._size = size;
        this._dataRect = dataRect;

        if (enableNavigation == undefined)
            enableNavigation = true;

        this._verticalAxis = new NumericAxis(location, dataRect.getVerticalRange(), new Size(null, size.height), Orientation.Vertical);

        this._horizontalAxisType = horizontalAxisType;

        if (horizontalAxisType == AxisTypes.NumericAxis) {
            this._horizontalAxis = new NumericAxis(new NumericPoint(location.x, location.y + size.height), dataRect.getHorizontalRange(), new Size(size.width, null), Orientation.Horizontal);
        }
        else if (horizontalAxisType == AxisTypes.StringAxis) {
            this._horizontalAxis = new StringAxis(new NumericPoint(location.x, location.y + size.height), dataRect.getHorizontalRange(), new Size(size.width, null), Orientation.Horizontal, null);
        }
        else {
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

    Chart.createChart = function (elementID, dataRect, horizontalAxisType, enableNavigation) {
        /// <summary>Creates new instance of chart with keyboard navigation.</summary>
        /// <param name="elementID" type="String">Element id to render on.</param>
        /// <param name="dataRect" type="DataRect">Currently visible rectangle on chart.</param>
        /// <param name="horizontalAxisType" type="Number">Type of horizontal axis.</param>
        /// <param name="enableNavigation" type="Boolean">Optional parameter, which indicates, whether chart navigation is enabled. Default value is true.</param>

        if (enableNavigation == undefined)
            enableNavigation = true;

        var element = document.getElementById(elementID);
        var width = $(element).width();
        var height = $(element).height();
        $(element).css({ 'width': '', 'height': '' });
        var renderer = new Renderer(elementID, new Size(width, height), enableNavigation);

        var customChartRenderMargin = element.getAttribute('data-chart-render-margin');

        if (customChartRenderMargin == undefined) {
            customChartRenderMargin = Chart.renderMargin;
        }
        else {
            customChartRenderMargin = parseFloat(customChartRenderMargin);
        }

        var chartAdditionalMarginRight = 0;
        var chartAdditionalMarginRightString = element.getAttribute('data-chart-additional-margin-right');

        if (chartAdditionalMarginRightString != undefined) {
            chartAdditionalMarginRight = parseFloat(chartAdditionalMarginRightString);
        }

        var chartAdditionalMarginBottom = 0;
        var chartAdditionalMarginBottomString = element.getAttribute('data-chart-additional-margin-bottom');

        if (chartAdditionalMarginBottomString != undefined) {
            chartAdditionalMarginBottom = parseFloat(chartAdditionalMarginBottomString);
        }

        var chartSize = renderer.getAvailableSize(customChartRenderMargin);

        chartSize.width -= chartAdditionalMarginRight;
        chartSize.height -= chartAdditionalMarginBottom;

        var chart = new Chart(new NumericPoint(customChartRenderMargin, customChartRenderMargin), chartSize, new DataRect(0, 0, 1, 1), horizontalAxisType, enableNavigation);
        chart.attach(renderer);

        if (enableNavigation) {
            var keyboardNavigation = new KeyboardNavigation();
            keyboardNavigation.attachToChart(chart);
            chart._keyboardNavigation = keyboardNavigation;
        }

        return chart;
    }

    var p = Chart.prototype;

    p._location = null;
    p._size = null;
    p._dataRect = null;

    p._horizontalAxis = null;
    p._verticalAxis = null;
    p._chartGrid = null;
    p._navigationLayer = null;
    p._keyboardNavigation = null;

    p._navigationKineticLayer = null;
    p._uiLayer = null;

    p._legendPart = null;

    p._headerLabel = null;
    p._labelVerticalMargin = 0;

    p.renderer = null;
    p._plots = null;
    p._horizontalAxisType = null;

    p._fixedTopBound = null;

    /**Legend settings**/
    p._legendOpacity = 0.5;
    p._legendOffsetTop = 0;
    p._legendOffsetRight = 0;
    p._legendFontSize = 10;
    p._legendRectangleSize = 10;
    /*******************/

    p.attach = function (renderer) {
        /// <summary>Attaches chart to specified renderer.</summary>
        /// <param name="renderer" type="Renderer">Renderer to attach to.</param>

        if(renderer == undefined || renderer == null || !(renderer instanceof Renderer))
        {
            throw 'Renderer must be not null and have Renderer type';
        }

        var container = renderer.getContainer();
        this._initializeFromArguments(container);

        //TODO: destroy layers after detaching too.
        Chart._createLayers(this, renderer);

        renderer.add(this._verticalAxis);
        if (this._horizontalAxisType != AxisTypes.None)
            renderer.add(this._horizontalAxis);
        renderer.add(this._chartGrid);

        if (this._navigationLayer != null) {
            renderer.add(this._navigationLayer);
        }

        for (var i = 0; i < this._plots.length; i++) {
            var plot = this._plots[i];
            renderer.add(plot);
        }

        var header = container.getAttribute('data-header-text');
        if (header != undefined) {
            var headerFont = container.getAttribute('data-header-font');
            if (headerFont != undefined) {
                var margin = container.getAttribute('data-header-vertical-margin');
                if (margin != undefined) {
                    this._labelVerticalMargin = parseFloat(margin);
                }

                var labelLocation = new NumericPoint(this._location.x, this._location.y + this._labelVerticalMargin);

                this._headerLabel = new RenderedLabel(header, headerFont, labelLocation, this._size.width, HorizontalAlignment.Center);
                var foregroundColor = container.getAttribute('data-header-foreground-color');
                if (foregroundColor != undefined) {
                    this._headerLabel.foregroundColor = foregroundColor;
                }
                renderer.add(this._headerLabel);
            }
            else {
                this._headerLabel = null;
            }

        }
        else {
            this._headerLabel = null;
        }

        this.update(this._location, this._size, this._dataRect);

        this.renderer = renderer;
    }

    p.setHeader = function (text) {
        /// <summary>Updates chart's header text.</summary>
        /// <param name="text" type="String">New header text.</param>
        if (this._headerLabel == null)
            throw 'Header is not initialized yet';
        this._headerLabel.setText(text);
    }

    p.hasHeader = function () {
        /// <summary>Returns true, if chart has header. Otherwise, returns false.</summary>
        return !(this._headerLabel == null);
    }

    p._initializeFromArguments = function (element) {
        /// <summary>Gets chart's initial arguments out from data attributes.</summary>
        /// <param name="element" type="Element">Element, from which to read attributes</param>
        var legendOpacity = element.getAttribute('data-legend-opacity');
        var offsetTop = element.getAttribute('data-legend-offset-top');
        var offsetRight = element.getAttribute('data-legend-offset-right');
        var legendFontSize = element.getAttribute('data-legend-font-size');
        var legendRectangleSize = element.getAttribute('data-legend-rectangle-size');

        if (legendOpacity != undefined) {
            this._legendOpacity = parseFloat(legendOpacity);
        }

        if (offsetTop != undefined) {
            this._legendOffsetTop = parseFloat(offsetTop);
        }

        if (offsetRight != undefined) {
            this._legendOffsetRight = parseFloat(offsetRight);
        }

        if (legendFontSize != undefined) {
            this._legendFontSize = parseFloat(legendFontSize);
        }

        if (legendRectangleSize != undefined) {
            this._legendRectangleSize = parseFloat(legendRectangleSize);
        }
    }


    p.update = function (location, size, dataRect) {
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

    p.detach = function () {
        /// <summary>Detaches chart from renderer.</summary>

        if (this.renderer == null)
            throw 'Chart is not attached to any renderer';

        this.renderer.remove(this._verticalAxis);
        if (this._horizontalAxisType != AxisTypes.None)
            this.renderer.remove(this._horizontalAxis);
        this.renderer.remove(this._chartGrid);
        if (this._navigationLayer != null) {
            this.renderer.remove(this._navigationLayer);
        }
        if (this._keyboardNavigation != null)
        {
            this._keyboardNavigation.detach();
        }

        if (this._headerLabel != null) {
            this.renderer.remove(this._headerLabel);
        }

        for (var i = 0; i < this._plots.length; i++) {
            var plot = this._plots[i];
            this.renderer.remove(plot);
        }

        if (this._legendPart != null) {
            this._legendPart.remove();
            this._legendPart = null;
        }

        this._uiLayer.remove();

        this.renderer = null;
    }

    p.addPlot = function (plot) {
        /// <summary>Adds plot to chart.</summary>
        /// <param name="plot" type="Plot">Plot to add to chart.</param>

        if (this.renderer == null)
            throw 'Attach chart to renderer first.';

        // TODO: remove plot layer on removePlot.
        Chart._addPlotLayer(this, this.renderer, plot.getLayerName());

        this._plots.push(plot);
        if (this.renderer != null) {
            this.renderer.add(plot);
        }

        plot.propertyChanged.addListener('dataSeries', Chart._onPlotDataSeriesChanged, this);

        if (this._horizontalAxisType == AxisTypes.StringAxis) {
            this._updateStringLabels();

            this.update(this._location, this._size, this._dataRect);
        }
        else {
            var verticalAxisWidth = this._verticalAxis.getActualWidth();
            var horizontalAxisWidth = this._size.width - verticalAxisWidth
            var verticalAxisHeight = this._verticalAxis.getActualHeight();

            var labelOffsetY = 0;

            if (this._headerLabel != null) {
                labelOffsetY += this._labelVerticalMargin * 2 + this._headerLabel.getActualHeight();
            }

            var gridLocation = new NumericPoint(this._location.x + verticalAxisWidth, this._location.y + labelOffsetY);

            plot.setScreen(new DataRect(gridLocation.x, gridLocation.y, horizontalAxisWidth, verticalAxisHeight));
            plot.setVisible(this._dataRect);
        }

        this._updateLegend();
    }

    Chart._onPlotDataSeriesChanged = function (event, state)
    {
        var chart = state;
        if (chart._horizontalAxisType == AxisTypes.StringAxis) {
            chart._updateStringLabels();
        }

        chart._updateLegend();
    }

    p._updateStringLabels = function () {
        /// <summary>Updates string labels in case, when this chart has string plot.</summary>

        var keys = [];
        var resLabels = [];
        for (var i = 0; i < this._plots.length; i++) {
            var plot = this._plots[i];
            var labels = plot._getStringLabels();
            for (var j = 0; j < labels.length; j++) {
                var label = labels[j];
                if (keys.indexOf(label.key) < 0) {
                    resLabels.push(label);
                    keys.push(label.key);
                }
            }
        }
        if (this._horizontalAxisType != AxisTypes.None)
            this._horizontalAxis.setLabels(resLabels);
    }

    p.removePlot = function (plot) {
        /// <summary>Removes plot from chart.</summary>
        /// <param name="plot" type="Plot">Plot to remove from chart.</param>
        var plotIndex = this._plots.indexOf(plot);
        this._plots.splice(plotIndex, 1);

        if (this.renderer != null) {
            this.renderer.remove(plot);
        }

        plot.propertyChanged.removeListener('dataSeries', Chart._onPlotDataSeriesChanged);

        if (this._horizontalAxisType == AxisTypes.StringAxis) {
            this._updateStringLabels();
        }
        else {
            this.update(this._location, this._size, this._dataRect);
        }

        this._updateLegend();
    }

    p.fitToView = function () {
        /// <summary>Fits all plots on chart to view.</summary>
        var plotsEnum = Enumerable.From(this._plots);
        var firstPlot = plotsEnum.FirstOrDefault(null);
        if (firstPlot == null) {
            return;
        }
        else {
            var boundingRect = firstPlot.getBoundingRectangle();
            for (var i = 1; i < this._plots.length; i++) {
                var plot = this._plots[i];
                boundingRect.merge(plot.getBoundingRectangle());
            }

            var coeff = 0.03;

            var horSize = boundingRect.getHorizontalRange().getLength();
            var verSize = boundingRect.getVerticalRange().getLength();

            var offsetX = horSize * coeff;
            var offsetY = verSize * coeff;

            boundingRect = new DataRect(
                boundingRect.minX - offsetX / 2,
                boundingRect.minY - offsetY / 2,
                boundingRect.width + offsetX,
                boundingRect.height + offsetY);

            if (this._fixedTopBound != null) {
                boundingRect.height = (this._fixedTopBound - boundingRect.minY) * (1 + coeff);
            }
            if (boundingRect.height == 0) {
                boundingRect.height = 1;
            }
            if (boundingRect.width == 0)
                boundingRect.width = 0;
            this.update(this._location, this._size, boundingRect);
        }
    }

    p.zoom = function (delta) {
        /// <summary>Zooms chart view by specified delta.</summary>
        /// <param name="delta" type="Number">Zoom delta.</param>

        var horRange = this._dataRect.getHorizontalRange();
        var verRange = this._dataRect.getVerticalRange();

        var horSize = horRange.getLength();
        var verSize = verRange.getLength();

        var zoomCoeff = 0.01;
        var sign = delta > 0 ? 1 : -1;

        var deltaX = horSize * zoomCoeff * sign;
        var deltaY = verSize * zoomCoeff * sign;

        horRange.min += deltaX;
        horRange.max -= deltaX;

        verRange.min += deltaY;
        verRange.max -= deltaY;

        if (horRange.max - horRange.min >= 1e-8 && verRange.max - verRange.min >= 1e-8) {
            var rect = new DataRect(horRange.min, verRange.min, horRange.max - horRange.min, verRange.max - verRange.min);

            this.update(this._location, this._size, rect);
        }
    }

    p.showLegend = function () {
        if (this._legendPart == null) {
            this._updateLegend();
        }
        this._legendPart.show();
    }

    p.hideLegend = function () {
        /// <summary>Hides legend, if it is shown.</summary>
        if (this._legendPart == null) {
            throw 'Legend is not shown yet';
        }
        this._legendPart.hide();
    }

    p._updateLegend = function () {
        /// <summary>Updates current legend.
        /// By default, legend is hidden and can be shown by calling 'showLegend'
        /// </summary>
        if (this.renderer == null) {
            throw 'To generate legend, renderer must be attached first';
        }

        if (this._legendPart == null) {
            var container = this.renderer.getContainer();
            var legendElement = $('<div></div>').css('padding', '0.5em').css('position', 'absolute').addClass('ui-widget-content');
            legendElement.css('right', '0px');
            legendElement.css('margin-right', this._legendOffsetRight);
            legendElement.css('margin-top', this._legendOffsetTop);
            legendElement.css('opacity', this._legendOpacity);
            legendElement.css('font-size', this._legendFontSize);
            $(this._uiLayer).append(legendElement);

            this._legendPart = legendElement;

            this._legendPart.hide();
        }

        var legendPart = this._legendPart;

        var allLegendItems = [];

        //Get collection of all legend itema from all plots.
        for (var i = 0; i < this._plots.length; i++) {
            var plot = this._plots[i];
            var legendItems = plot.getLegendItems();

            for (var j = 0; j < legendItems.length; j++) {
                var legendItem = legendItems[j];
                var alreadyContains = false;
                for (var k = 0; k < allLegendItems.length; k++) {
                    var itm = allLegendItems[k];
                    if (legendItem.name == itm.name && legendItem.color == itm.color) {
                        alreadyContains = true;
                    }
                }
                if (!alreadyContains) {
                    allLegendItems.push(legendItem);
                }
            }
        }

        legendPart.empty();

        //Build legend table with all legend items
        var legendTable = $('<table></table>');
        for (var i = 0; i < allLegendItems.length; i++) {
            var legendItem = allLegendItems[i];

            var colorColumn = $('<td></td>');
            var colorDiv = $('<div></div>');
            colorDiv.width(this._legendRectangleSize).height(this._legendRectangleSize).css('background-color', legendItem.color);
            colorColumn.append(colorDiv);

            var nameColumn = $('<td></td>');
            var nameDiv = $('<div>' + legendItem.name + '</div>');
            nameColumn.append(nameDiv);

            var row = $('<tr></tr>');
            row.append(colorColumn);
            row.append(nameColumn);
            legendTable.append(row);
        }

        legendPart.append(legendTable);
    }

    p.getPlots = function () {
        /// <summary>Returns chart's plots.</summary>
        /// <returns type="Array" />
        return this._plots;
    }

    p.getHorizontalAxis = function () {
        /// <summary>Returns chart's horizontal axis, or null, if chart has no horizontal axis.</summary>
        /// <returns type="AxisBase" />
        return this._horizontalAxis;
    }

    p.getVerticalAxis = function () {
        /// <summary>Returns chart's vertical axis.</summary>
        /// <returns type="AxisBase" />
        return this._verticalAxis;
    }

    p.getRenderer = function () {
        /// <summary>Returns renderer, thich chart is attached to.</summary>
        /// <returns type="Renderer" />
        if (this.renderer == undefined)
            throw 'This chart is not attached to any renderer';
        return this.renderer;
    }

    /// <summary>Creates layers, required by chart, in specified renderer.</summary>
    /// <param name="chart" type="Chart">Chart, to which layer will be added.</param>
    /// <param name="renderer" type="Renderer">Renderer, to add layers to.</param>
    Chart._createLayers = function (chart, renderer) {
        var stage = renderer.getStage();
        var chartLayer = new Kinetic.Layer();
        chartLayer.name = 'chartLayer';
        stage.add(chartLayer);

        var labelsLayer = new Kinetic.Layer();
        labelsLayer.name = 'labelsLayer';
        stage.add(labelsLayer);

        chart._uiLayer = renderer.getStage().getUIlayer();

        if (chart._navigationLayer != null) {
            var navigationKineticLayer = new Kinetic.Layer();
            navigationKineticLayer.name = 'navigationLayer';
            stage.add(navigationKineticLayer);
        }

        chart._navigationKineticLayer = navigationKineticLayer;
    }

    /// <summary>Adds layer with specified name.</summary>
    /// <param name="chart" type="Chart">Chart, to which layer will be added.</param>
    /// <param name="renderer" type="Renderer">Renderer, to add layers to.</param>
    /// <param name="layerName" type="String">Name of layer to add.</param>
    Chart._addPlotLayer = function (chart, renderer, layerName) {
        var stage = renderer.getStage();
        var newLayer = new Kinetic.Layer();
        newLayer.name = layerName;
        stage.insertBefore(newLayer, chart._uiLayer);

    }

    p.setFixedTopBound = function (newTopBound) {
        /// <summary>If top bound while fitting to view must be fixed, pass specific value to this method.</summary>
        /// <param name="newTopBound" type="Number">New fin to view bound, or null.</param>
        this._fixedTopBound = newTopBound;
    }

    //Render margin around chart.
    Chart.renderMargin = 5;
    //Chart's minimum zoom delta.
    Chart.minZoomLevel = 1e-8;

    window.Chart = Chart;
}(window));
