/// <reference path="../Common/Range.js" />
/// <reference path="MinorTicksGenerator.js"/>

(function (window) {


    var TicksGenerator = function () {
        /// <summary>Ticks generator. It is used for generating ticks on numeric axes.</summary>
        this.showMinorTicks = true;
        this.minorTicksCount = TicksGenerator.defaultMinorTicksCount;
    }

    TicksGenerator.defaultTicksCount = 10;
    TicksGenerator.defaultMinorTicksCount = 4;

    TicksGenerator.tickCounts = new Array(80, 40, 20, 10, 5, 4, 3, 2, 1);
    TicksGenerator.reversedTickCounts = new Array();

    for (var i = 0; i < TicksGenerator.tickCounts.length; i++) {
        TicksGenerator.reversedTickCounts.push(TicksGenerator.tickCounts[TicksGenerator.tickCounts.length - i - 1]);
    }

    var p = TicksGenerator.prototype;
    p.showMinorTicks = true;

    p.minorTicksCount = 0;

    /// <summary>Generates ticks in specified range.</summary>
    /// <param name="range" type="Range">Range, between which to generate ticks.</param>
    /// <param name="ticksCount" type="Number">Number of ticks to generate.</param>
    p.generateTicks = function (range, ticksCount) {
        //Transform range to the correct type (in VS intellisence). Otherwise, no intellisence will be shown.
        range = range || new Range();

        var start = range.min;
        var finish = range.max;
        var delta = finish - start;

        if (delta == 0)
            return new Array(start, finish);

        var log = Math.round(Math.log10(delta));
        var newStart = window.round(start, log);
        var newFinish = window.round(finish, log);
        if (newStart == newFinish) {
            log--;
            newStart = window.round(start, log);
            newFinish = window.round(finish, log);
        }

        var unroundedStep = (newFinish - newStart) / ticksCount;
        var stepLog = log;
        var step = window.floor(unroundedStep, stepLog);
        if (step == 0) {
            stepLog--;
            step = window.floor(unroundedStep, stepLog);
            if (step == 0)
                step = unroundedStep;
        }


        var x = step * Math.floor(start / step);
        var res = [];
        var increasedFinish = finish + step;
        while (x <= increasedFinish) {
            res.push(window.round(x, log - 3));
            x += step;
        }

        return res;
    }

    p.increaseTicksCount = function (ticksCount) {
        var newTickCount = 0;
        for (var i = 0; i < TicksGenerator.reversedTickCounts.length; i++) {
            if (TicksGenerator.reversedTickCounts[i] > ticksCount)
                newTickCount = TicksGenerator.reversedTickCounts[i];
        }

        if (newTickCount == 0)
            newTickCount = TicksGenerator.reversedTickCounts[0];

        return newTickCount;
    }

    p.decreaseTickCount = function (ticksCount) {
        for (var i = 0; i < TicksGenerator.tickCounts.length; i++) {
            if (TicksGenerator.tickCounts[i] < ticksCount)
                return TicksGenerator.tickCounts[i];
        }
        return 0;
    }

    p.generateMinorTicks = function (range, ticks) {
        //Transform range to the correct type (in VS intellisence). Otherwise, no intellisence will be shown.
        range = range || new Range();
        //Transform ticks array to the correct type (in VS intellisence). Otherwise, no intellisence will be shown.
        ticks = ticks || new Array();

        //In case, when there are only two ticks, there will be no minor ticks.
        if (ticks.length < 2)
            return null;

        //Create and fill ticks array.
        var res = [];
        var step = (ticks[1] - ticks[0]) / (this.minorTicksCount + 1);

        var minTick = ticks[0];
        var minBound = minTick;

        var maxTick = ticks[ticks.length - 1];
        var maxBound = maxTick;

        var rangeMin = range.min;
        var rangeMax = range.max;

        if (minTick < rangeMin) {
            minBound = rangeMin;
        }

        if (maxTick > rangeMax) {
            maxBound = rangeMax;
        }

        var x = ticks[1] - step;
        while (x >= minBound) {
            res.push(x);
            x -= step;
        }

        x = ticks[ticks.length - 2] + step;
        while (x <= maxBound) {
            res.push(x);
            x += step;
        }

        for (var i = 1; i < ticks.length - 1; i++) {
            x = ticks[i] + step;

            for (var j = 0; j < this.minorTicksCount; j++) {
                res.push(x);
                x += step;
            }
        }

        //Return ticks array.
        return res;
    }

    window.TicksGenerator = TicksGenerator;

    window.clamp = function (val, min, max) {
        return Math.max(min, Math.min(val, max))
    }

    window.toFixed = function (num, digits) {
        return Math.round(num * Math.pow(10, digits)) / Math.pow(10, digits);
    }

    window.floor = function (number, rem) {
        if (rem <= 0)
            rem = clamp(-rem, 0, 15);
        var pow = Math.pow(10, rem - 1);
        return pow * Math.floor(number / Math.pow(10, rem - 1));
    }

    window.round = function (number, rem) {
        if (rem <= 0) {
            rem = clamp(-rem, 0, 15);
            return window.toFixed(number, rem);
        }
        var pow = Math.pow(10, rem - 1);
        return pow * Math.round(number / Math.pow(10, rem - 1));
    }

    Math.log10 = function (number) {
        return Math.log(number) / 2.302585092994046;
    }

}(window));