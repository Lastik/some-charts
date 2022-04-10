/// <reference path="../plotbase/plot.js" />
/// <reference path="../common/coordinatetransform.js" />
/// <reference path="../common/datarect.js" />

(function (window) {

    var MarkerPlot = function () {
        /// <summary>Creates marker plot, which is used to display markers on chart.</summary>

        Plot.call(this);

        this._innerShape.plot = this;

        this.markerFill = "blue";
        this.markerSize = 5;

        this._innerShape.drawFunc = function () {
            var dataSource = this.dataSource;
            var self = this.plot;

            var screen = self._screen;
            var screenLocaton = screen.getMinXMinY();
            var screenSize = screen.getSize();

            var context = this.getContext();

            context.save();
            context.beginPath();
            context.rect(screenLocaton.x + 0.5, screenLocaton.y + 0.5, screenSize.width - 0.5, screenSize.height - 0.5);
            context.clip();

            for (var i = 0; i < dataSource.length; i++) {
                var point = dataSource[i];
                var pointLocation = CoordinateTransform.dataToScreenXY(point, self._visible, screenSize);

                pointLocation.x += screenLocaton.x;
                pointLocation.y += screenLocaton.y;

                context.beginPath();
                context.arc(pointLocation.x, pointLocation.y, self.markerSize, 0, Math.PI * 2, true);
                context.fillStyle = self.markerFill;
                context.fill();
                context.lineWidth = 1;
                context.stroke();
            }

            context.stroke();
            context.restore();
        };
    }

    MarkerPlot.prototype = new Plot();

    var p = MarkerPlot.prototype;
    p.markerSize = null;
    p.markerFill = null;

    window.MarkerPlot = MarkerPlot;

}(window));