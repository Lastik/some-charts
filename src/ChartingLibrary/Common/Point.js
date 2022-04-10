(function (window) {

    var Point = function (x, y) {
        /// <summary>Creates point with x and y coordinates.</summary>
        /// <param name="x" type="Number">Point x coordinate.</param>
        /// <param name="y" type="Number">Point y coordinate.</param>
        this.x = x;
        this.y = y;
    }

    var p = Point.prototype;

    p.x = 0;
    p.y = 0;

    window.Point = Point;

    Point.compare = function (point1, point2) {
        /// <summary>Compares x coordinates of two points.</summary>
        /// <param name="point1" type="Point">First point to compare.</param>
        /// <param name="point2" type="Point">Second point to compare.</param>
        if (point1.x < point2.x)
            return -1;
        else if (point1.x > point2.x)
            return 1;
        return 0;
    }

}(window));