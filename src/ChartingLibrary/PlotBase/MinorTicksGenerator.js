/// <reference path="../Common/Range.js" />

(function (window) {


    var MinorTicksGenerator = function () {
        this.ticksCount = MinorTicksGenerator.defaultTicksCount;
    }

    MinorTicksGenerator.defaultTicksCount = 5;

    var p = MinorTicksGenerator.prototype;

    p.ticksCount = 0;

    p.getTicksCount = function () {
        return this.ticksCount;
    }

    p.setTicksCount = function (newTicksCount) {
        this.ticksCount = newTicksCount;
    }

    /// <summary>This function generates minor.</summary>
    /// <param name="range" type="Range">Ticks range.</param>
    /// <param name="ticks">Other (simple) ticks.</param>
    p.generateTicks = function (range, ticks) {
        //Transform range to the correct type (in VS intellisence). Otherwise, no intellisence will be shown.
        range = range || new Range();
        //Transform ticks array to the correct type (in VS intellisence). Otherwise, no intellisence will be shown.
        ticks = ticks || new Array();

        //In case, when there are only two ticks, there will be no minor ticks.
        if (ticks.length < 2)
            return null;

        //Create and fill ticks array.
        var res = [];
        var step = (ticks[1] - ticks[0]) / (this.ticksCount);
        var i = 0;

        var rangeMin = range.getMin();
        var rangeMax = range.getMax();

        if (rangeMin > ticks[0]) {
            var x = ticks[1] - step;

            while (x >= rangeMin) {
                res.push(x);
                x -= step;
            }
            i++;
        }

        var fin = ticks.length - 1;
        if (ticks[fin] > rangeMax) {
            fin--;
        }
        for (; i < fin; i++) {
            var x = ticks[i] + step;
            for (var j = 0; j < this.ticksCount - 1; j++) {
                res.push(x);
                x += step;
            }
        }
        if (fin != ticks.length - 1) {
            var x = ticks[fin] + step;
            while (x <= rangeMax) {
                res.push(x);
                x += step;
            }
        }

        //Return ticks array.
        return res;
    }

    window.MinorTicksGenerator = MinorTicksGenerator;

}(window));