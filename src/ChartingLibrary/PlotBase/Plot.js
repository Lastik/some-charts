/// <reference path="../common/size.js" />
/// <reference path="../common/point.js" />
/// <reference path="../common/size.js" />
/// <reference path="../core/renderableitem.js" />
/// <reference path="../../utils/kinetic-v3.6.1.js" />
/// <reference path="../common/datarect.js" />
/// <reference path="../common/range.js" />
/// <reference path="../../utils/rx.jquery.js" />
/// <reference path="../common/dataseries.js" />
/// <reference path="../../utils/rx.js" />
/// <reference path="../core/commonrenderableitem.js" />
/// <reference path="../../utils/linq.min.js" />
/// <reference path="../common/keyvaluepair.js" />
/// <reference path="../common/datapoint.js" />
/// <reference path="../common/eventtarget.js" />
/// <reference path="../../utils/linq.min.js" />
/// <reference path="../common/dataseries.js" />
/// <reference path="../common/legenditem.js" />
/// <reference path="../common/stringdatapoint.js" />

(function (window) {

    var Plot = function () {
        /// <summary>Represents single plot on chart.</summary>

        CommonRenderableItem.call(this);

        this._layerName = Math.random().toString();
        this._dependantLayers = new Array(this._layerName);

        this._innerShape = new Kinetic.Shape({ drawFunc: function (){ }});

        this._dataSeriesCollection = [];
        this._innerShape.values = this.values;
        this._innerShape.plot = this;

        this.propertyChanged = new EventTarget();
    }

    Plot.prototype = new CommonRenderableItem();

    var p = Plot.prototype;

    Plot.stringLabelsOffset = 10;

    //Name of layer, on shich this plot is rendered.
    p._layerName = null;
    //Inner shape, which represents entire plot's content.
    p._innerShape = null;
    //Plot's visible rectangle.
    p._visible = null;
    //Plot's screen (it's size).
    p._screen = null;

    //Occurs, when some property of plot changed it's value.
    p.propertyChanged = null;

    //Collection of data series, plot must render.
    p._dataSeriesCollection = null;
    // Collection of specific labels on axis.
    // Is used only for string axis.
    p._stringLabels = null;

    p._dependantLayers = null;

    p.getLayerName = function () {
        /// <summary>Returns name of layer, this plot is supposed to render on.</summary>
        /// <returns type="String" />
        return this._layerName;
    }

    p.setDataSeries = function (dataSeries) {
        /// <summary>Sets single data series to plot.</summary>
        /// <param name="setDataSeries" type="DataSeries">Data series to set.</param>
        if (dataSeries == null || dataSeries == undefined)
            throw 'Data series must be not null and not undefined';
        if (dataSeries.data == null || dataSeries.data.length == 0) {
            throw 'Data array of series must be not null and not empty';
        }
        this.setDataSeriesArray(new Array(dataSeries));
    }

    p.setDataSeriesArray = function (dataSeriesArray) {
        /// <summary>Sets collection of data series to plot.</summary>
        /// <param name="dataSeriesArray">Colleclion of data series to set</param>

        if (dataSeriesArray == null || dataSeriesArray == undefined)
            throw 'Data series array must be not null and not undefined';

        var firstSeries = Enumerable.From(dataSeriesArray).FirstOrDefault(null);
        if (!firstSeries instanceof DataSeries) {
            throw 'Data series array must be filled with data series';
        }

        var newStringLabels = [];
        var newDataSeriesArray = [];

        var curIdx = 0;
        var addedXs = [];
        var addedKeys = [];

        for (var i = 0; i < dataSeriesArray.length; i++) {
            var dataSeries = dataSeriesArray[i];

            if (dataSeries.data == null || dataSeries.data.length == 0) {
                throw 'Data array of series must be not null and not empty';
            }

            var dataSource = dataSeries.data;
            var ordered = dataSeries.ordered;

            var firstValue = null;
            if (dataSource != null)
                firstValue = Enumerable.From(dataSource).FirstOrDefault(null);

            if (!ordered) {
                if (dataSource != null) {
                    if (firstValue.constructor == Point) {
                        //Array of points.
                        dataSource.sort(Point.compare);
                        dataSeries.ordered = true;
                    }
                    else if (firstValue.constructor == DataPoint) {
                        //Nothing to do here.
                    }
                }
            }

            if (firstValue.constructor == Point) {
                newDataSeriesArray.push(dataSeries);
            }
            else if (firstValue instanceof StringDataPoint) {
                var ds = [];
                for (var j = 0; j < dataSource.length; j++) {
                    var stringPoint = dataSource[j];

                    var x = null;
                    var index = addedKeys.indexOf(stringPoint.key);
                    if (index >= 0) {
                        x = addedXs[index];
                    }
                    else {
                        x = (curIdx++) * Plot.stringLabelsOffset;
                        addedKeys.push(stringPoint.key);
                        addedXs.push(x)
                    }

                    ds.push(new Point(x, stringPoint.value));

                    var alreadyContains = false;
                    for (var k = 0; k < newStringLabels.length; k++) {
                        if (stringPoint.key == newStringLabels[k].key) {
                            alreadyContains = true;
                            break;
                        }
                    }

                    if (!alreadyContains) {
                        newStringLabels.push(new StringDataPoint(stringPoint.key, x));
                    }
                }

                var newSeries = new DataSeries(ds, true, dataSeries.name, dataSeries.color);

                newDataSeriesArray.push(newSeries);
            }
        }

        this._dataSeriesCollection = newDataSeriesArray;
        this._stringLabels = newStringLabels

        this._isDirty = true;
        
        //Notify about change in 'dataSource' property.
        this.propertyChanged.fire('dataSeries');
    }

    p.setVisible = function (visible) {
        /// <summary>Sets visible rectangle of chart.</summary>
        /// <param name="visible" type="DataRect">Visible rectange of data.</param>
        this._visible = visible;
        this._isDirty = true;
    }

    p.setScreen = function (screen) {
        /// <summary>Sets screen of chart.</summary>
        /// <param name="screenSize" type="DataRect">Screen of chart.</param>
        this._screen = screen;
        this._isDirty = true;
    }

    p._attachBase = p.attach;
    p.attach = function (renderer) {
        this._attachBase.call(this, renderer);

        var stage = renderer.getStage();
        var layer = stage.getLayer(this._layerName);
        this.chartLayer = layer;

        layer.add(this._innerShape);
    }

    p._detachBase = p.detach;
    p.detach = function (renderer) {
        this._detachBase(renderer);
        var stage = renderer.getStage();
        var layer = stage.getLayer(this._layerName);

        layer.remove(this._innerShape);
    }

    p.getDependantLayers = function () {
        return this._dependantLayers;
    }

    p.getBoundingRectangle = function () {
        /// <summary>Calculates bounding rectangle of specified plot.</summary>
        /// <returns type="DataRect" />
        var result = null;

        var firstSeries = Enumerable.From(this._dataSeriesCollection).FirstOrDefault(null);
        if (firstSeries == null) {
            //There are no series on the plot.
            //Return null.
            throw 'Unexpected exception';
        }
        else {
            for (var i = 0; i < this._dataSeriesCollection.length; i++) {
                var dataSeries = this._dataSeriesCollection[i];
                var dataSource = dataSeries.data;
                var firstValue = Enumerable.From(dataSource).FirstOrDefault(null);
                if (firstValue == null) {
                    continue;
                }
                else if (firstValue instanceof Point) {
                    for (var j = 0; j < dataSource.length; j++) {
                        var value = dataSource[j];
                        if (result == null) {
                            result = new DataRect(value.x, value.y, 0, 0);
                        }
                        else {
                            result.merge(new DataRect(value.x, value.y, 0, 0));
                        }
                    }
                }
                else {
                    throw 'Not implemented.';
                }
            }
            return result;
        }
    }

    p._getStringLabels = function () {
        /// <summary>Returns collection of StringDataPoint items with string labels for plot axes.
        /// If points are not StringDataPoints, null will be returned.</summary>
        /// <returns type="Array" />
        return this._stringLabels;
    }

    p._getDataSeries = function () {
    /// <summary>Returns collection of plot's data series.</summary>
        return this._dataSeriesCollection;
    }

    p.getLegendItems = function () {
        /// <summary>Returns collection of items to be displayed on legend for this Plot instance.</summary>
        var legendItems = [];
        for (var i = 0; i < this._dataSeriesCollection.length; i++) {
            var dataSeries = this._dataSeriesCollection[i];
            var color = dataSeries.color;
            var name = dataSeries.name;

            legendItems.push(new LegendItem(name, color));
        }
        return legendItems;
    }

    window.Plot = Plot;

}(window));