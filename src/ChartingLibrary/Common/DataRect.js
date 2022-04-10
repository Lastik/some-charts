/// <reference path="../Common/Range.js" />
/// <reference path="point.js" />
/// <reference path="size.js" />

(function (window) {

    var DataRect = function (minX, minY, width, height) {
    /// <summary>Creates new instance of DataRect -  rectangle with (minX, minY) location, width and height</summary>
    /// <param name="minX" type="Number">Minimum x value of rect.</param>
    /// <param name="minY" type="Number">Minimym Y value of rect.</param>
    /// <param name="width" type="Number">Rectangle's width.</param>
    /// <param name="height" type="Number">Rectangle's geight.</param>
        this.minX = minX;
        this.minY = minY;
        this.width = width;
        this.height = height;
    }

    var p = DataRect.prototype;

    p.getHorizontalRange = function () {
        /// <returns type="Range" />
        return new Range(this.minX, this.minX + this.width, false);
    }

    p.getVerticalRange = function () {
        /// <returns type="Range" />
        return new Range(this.minY, this.minY + this.height, false);
    }

    p.getMinXMinY = function () {
        /// <summary>Left Top corner of data rectangle..</summary>
        /// <returns type="Point" />
        return new Point(this.minX, this.minY);
    }

    p.getMaxXMaxY = function () {
        /// <summary>Right Bottom corner of data rectangle..</summary>
        /// <returns type="Point" />
        return new Point(this.minX + this.width, this.minY + this.height);
    }

    p.getSize = function () {
        /// <summary>Returns data rectangle size.</summary>
        /// <returns type="Size" />
        return new Size(this.width, this.height);
    }

    p.getCenter = function () {
        /// <summary>Returns data rectangle center.</summary>
        /// <returns type="Point" />
        return new Point(this.minX + this.width / 2, this.minY + this.height / 2);
    }

    p.merge = function (other) {
        /// <summary>Merges one data rectangle with other data rectangle.</summary>
        /// <param name="other" type="DataRect">Other rectangle.</param>
        var thisMinXminY = this.getMinXMinY();
        var thisMaxXmaxY = this.getMaxXMaxY();

        var otherMinXminY = other.getMinXMinY();
        var otherMaxXmaxY = other.getMaxXMaxY();

        var minX = Math.min(thisMinXminY.x, otherMinXminY.x);
        var minY = Math.min(thisMinXminY.y, otherMinXminY.y);

        var maxX = Math.max(thisMaxXmaxY.x, otherMaxXmaxY.x);
        var maxY = Math.max(thisMaxXmaxY.y, otherMinXminY.y);

        this.minX = minX;
        this.minY = minY;
        this.width = maxX - minX;
        this.height = maxY - minY;
    }

    p.minX = null;
    p.minY = null;
    p.width = null;
    p.height = null;

    window.DataRect = DataRect;

}(window));