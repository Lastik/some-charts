/// <reference path="../common/size.js" />
/// <reference path="widgets/tablecommon/tablecolorset.js" />
/// <reference path="plotbase/axisbase.js" />
/// <reference path="../../utils/jquery-1.8.2.min.js" />
/// <reference path="plots/barscolorset.js" />
/// <reference path="plotbase/axistypes.js" />
(function (window) {

    var ChartingExtensions = function () {
        /// <summary>Provides some functions for "Several lines of code" chart implementation.</summary>
    }

    var p = ChartingExtensions.prototype;

    ChartingExtensions.createChartDiv = function (parentDivID, chartOptions, chartSize) {
        /// <summary>Creates div element for storing chart and returns ids.</summary>
        /// <param name="parentDivID" type="String">ID of parent div.</param>
        /// <param name="chartOptions" type="Array">Array of options of chart view (colors, etc).</param>
        /// <param name="chartSize" type="Size">Chart size in pixels.</param>
        /// <returns type="DivsIDs" />
        var parent = $('#' + parentDivID);
        var containerDiv = $('<div></div>').css('position', 'absolute');
        var chartDiv = $('<div></div>');
        ChartingExtensions.initializeDivFromOptions(chartDiv, chartOptions);
        chartDiv.css('position', 'relative').css('width', chartSize.width).css('height', chartSize.height);
        var chartDivID = Math.round((Math.random() * 100000000)).toString();
        var containerDivID = Math.round((Math.random() * 100000000)).toString();
        chartDiv.attr('id', chartDivID);
        containerDiv.attr('id', containerDivID);
        containerDiv.append(chartDiv);
        parent.append(containerDiv);

        var ids = new DivsIDs();
        ids.chartDivID = chartDivID;
        ids.containerDivID = containerDivID;

        return ids;
    }

    ChartingExtensions.initializeDivFromOptions = function (div, chartOptions) {
        /// <summary>Initializes div from options array.</summary>
        /// <param name="chartOptions" type="Array">Array of options of chart view (colors, etc).</param>
        for (var i = 0; i < chartOptions.length; i++) {
            var chartOption = chartOptions[i];
            if (chartOption.value == null) {
                div.removeAttr(chartOption.name);
            }
            else {
                div.attr(chartOption.name, chartOption.value);
            }
        }
    }

    window.ChartingExtensions = ChartingExtensions;

}(window));

(function (window) {
    var DivsIDs = function () {
        /// <summary>Stores ids of table and chart divs and container div's id.</summary>
    }
    var p = DivsIDs.prototype;
    p.chartDivID = null;
    p.containerDivID = null;

    window.DivsIDs = DivsIDs;
}(window));

//Name of all currently supported chart options.
var ChartOptionsNames =
{
    "DataLegendOffsetRight": "data-legend-offset-right", //Offset of chart legend from right border.
    "DataLegendOffsetTop": "data-legend-offset-top", //Offset of chart legend from top border.
    "DataLegendOpacity": "data-legend-opacity", // Legend opacity.
    "DataLegendFontSize": "data-legend-font-size", // Legend font size.
    "DataLegendRectangleSize": "data-legend-rectangle-size", // Legend rectangle size.
    "DataRendererBackground": "data-renderer-background", // Renderer background.
    "DataRendererBorder": "data-renderer-border", // Renderer border.
    "DataAxisForegroundColor": "data-axis-foreground-color", // Axis foreground.
    "DataAxisBackground": "data-axis-background", // Axis background.
    "DataAxisFont": "data-axis-font", // Axis font.
    "DataAxisFontHeight": "data-axis-font-height", // Axis font height.
    "DataAxisTickHeight": "data-axis-tick-height", // Height of axis ticks.
    "DataAxisMinorTickHeight": "data-axis-minor-tick-height", // Height of axis minor ticks.
    "DataAxisDrawBorder": "data-axis-draw-border", // True, if axis border must be drawn. Otherwise, false.
    "DataGridForegroundColor": "data-grid-foreground-color", // Axis foreground color.
    "DataGridBackgroundColor": "data-grid-background-color", // Axis bacground color.
    "DataHeaderText": "data-header-text", // Header text.
    "DataHeaderFont": "data-header-font", // Header font.
    "DataHeaderForegroundColor": "data-header-foreground-color", // Header foregrund color.
    "DataHeaderVerticalMargin": "data-header-vertical-margin", // Header vertical margin. 
    "DataPlotDarkerBorder": "data-plot-darker-border", // True, if plot border must be darker than plot backround. Otherwise, must be false.
    "DataBarDrawLabelsOnBars": "data-bar-draw-labels-on-bars", // True, if labels must be drawn on bars. Otherwise, false.
    "DataBarLabelsFont": "data-bar-labels-font", // Bars labels font.
    "DataBarLabelsForeground": "data-bar-labels-foreground", // Bars labels foreground color.
    "DataBarLabelsPrecision": "data-bar-labels-precision", // Bars labels precision.
    "DataChartRenderMargin": "data-chart-render-margin", // Chart render margin.
    "DataChartRenderAdditionalMarginRight": "data-chart-additional-margin-right", // Additional chart margin from right side.
    "DataChartRenderAdditionalMarginBottom": "data-chart-additional-margin-bottom", // Additional chart margin from right side.
    "DataChartRendererCursor": "data-chart-cursor" // Cursor, set for chart.
};

(function (window) {
    /// <summary>Stores options of div.</summary>
    var Option = function (name, value) {
        /// <param name="name" type="String">Name of option.</param>
        /// <param name="value" type="String">Value of option.</param>
        this.name = name;
        this.value = value;
    }

    var p = Option.prototype;
    p.name = null;
    p.value = null;
    
    window.Option = Option;

}(window));