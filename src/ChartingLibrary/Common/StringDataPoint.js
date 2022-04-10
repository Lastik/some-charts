/// <reference path="datapoint.js" />

(function (window) {

    var StringDataPoint = function (key, value) {
        /// <summary>Creates data point with string key.</summary>
        /// <param name="key" type="String">Point key.</param>
        /// <param name="value" type="Number">Point value.</param>
        DataPoint.call(this, value);
        this.key = key;
    }

    StringDataPoint.prototype = new DataPoint(null);

    var p = StringDataPoint.prototype;

    p.key = null;

    window.StringDataPoint = StringDataPoint;

    p.compare = function (point1, point2) {
        /// <summary>Compares two data points.</summary>
        /// <param name="point1" type="DataPoint">First point to compare.</param>
        /// <param name="point2" type="DataPoint">Second point to compare.</param>

        throw 'Not supported';
    }

}(window));