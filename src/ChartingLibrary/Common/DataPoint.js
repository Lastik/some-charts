(function (window) {

    var DataPoint = function (value) {
        /// <summary>Creates data point.</summary>
        this.value = value;
    }

    var p = DataPoint.prototype;

    p.value = null;

    window.DataPoint = DataPoint;

    p.compare = function (point1, point2) {
        /// <summary>Compares two data points.</summary>
        /// <param name="point1" type="DataPoint">First point to compare.</param>
        /// <param name="point2" type="DataPoint">Second point to compare.</param>

        throw 'Not implemented';
    }

}(window));