/// <reference path="../../utils/jquery-1.8.2.min.js" />
/// <reference path="chart.js" />
/// <reference path="../common/utilities.js" />
// Array of keys, connected with corresponding key codes.
var Keys = { "LeftArrow": 37, "RightArrow": 39, "UpArrow": 38, "DownArrow": 40, "Plus": 187, "Minus": 189 };

// Global variable with all currently active keyboard navigations.
var _ChartNavigations7203439c19e24470a7bd6155c3a41b79 = [];

(function (window) {

    var KeyboardNavigation = function () {
        /// <summary>Chart's keyboard navigation.</summary>
    }

    var p = KeyboardNavigation.prototype;


    p.attachToChart = function (chart) {
        /// <summary>Attaches keyboard navigation to chart.</summary>
        /// <param name="chart" type="Chart">Target chart.</param>
        var container = chart.getRenderer().getContainer();
        this.attach(container, chart);
    }

    p.attach = function (host, chart) {
        /// <summary>Attaches keyboard navigation to chart.</summary>
        /// <param name="host" type="Element">Host element, which will get keyboart events.</param>
        /// <param name="chart" type="Chart">Target chart.</param>

        this._host = host;
        this._chart = chart;

        var body = $('body');
        body.keydown(this._onKeyDown);

        this._host.keyNavigation7203439c19e24470a7bd6155c3a41b79 = this;

        $(this._host).focusin(function () {
            var keyNavigation = this.keyNavigation7203439c19e24470a7bd6155c3a41b79;
            keyNavigation._isHostFocused = true;
        });

        $(this._host).focusout(function () {
            var keyNavigation = this.keyNavigation7203439c19e24470a7bd6155c3a41b79;
            keyNavigation._isHostFocused = false;
        });

        _ChartNavigations7203439c19e24470a7bd6155c3a41b79.push(this);
    }

    p.detach = function () {
        /// <summary>Detaches keyboard navigation from chart.</summary>
        $(document.rootElement).unbind('keydown')
        $(this._host).unbind('focusin');
        $(this._host).unbind('focusout');

        this._host.keyNavigation7203439c19e24470a7bd6155c3a41b79 = null;

        this._host = null;
        this._chart = null;

        var idx = _ChartNavigations7203439c19e24470a7bd6155c3a41b79.indexOf(this);
        _ChartNavigations7203439c19e24470a7bd6155c3a41b79.splice(idx,1);
    }

    p._host = null;
    p._chart = null;
    p._isHostFocused = false;

    p._onKeyDown = function (e) {
        var keynum;
        var keychar;
        var numcheck;

        for (var i = 0; i < _ChartNavigations7203439c19e24470a7bd6155c3a41b79.length; i++) {
            var keyNavigation = _ChartNavigations7203439c19e24470a7bd6155c3a41b79[i];

            if (keyNavigation._isHostFocused) {

                if (window.event) // IE
                {
                    keynum = e.originalEvent.keyCode;
                }
                else if (e.which) // Netscape/Firefox/Opera
                {
                    keynum = e.which;
                }

                var chart = keyNavigation._chart;

                var horRange = chart._dataRect.getHorizontalRange();
                var verRange = chart._dataRect.getVerticalRange();
                var horDiff = horRange.max - horRange.min;
                var verDiff = verRange.max - verRange.min;

                var offsetHor = horDiff * 0.01;
                var offsetVer = verDiff * 0.01;
                if (keynum == Keys.LeftArrow) {
                    horRange.min -= offsetHor;
                    horRange.max -= offsetHor;
                }

                else if (keynum == Keys.RightArrow) {
                    horRange.min += offsetHor;
                    horRange.max += offsetHor;
                }

                else if (keynum == Keys.DownArrow) {
                    verRange.min -= offsetVer;
                    verRange.max -= offsetVer;
                }

                else if (keynum == Keys.UpArrow) {
                    verRange.min += offsetVer;
                    verRange.max += offsetVer;
                }

                else if (keynum == Keys.Plus) {
                    horRange.min += offsetHor;
                    horRange.max -= offsetHor;

                    verRange.min += offsetVer;
                    verRange.max -= offsetVer;
                }

                else if (keynum == Keys.Minus) {
                    horRange.min -= offsetHor;
                    horRange.max += offsetHor;

                    verRange.min -= offsetVer;
                    verRange.max += offsetVer;
                }

                if (horRange.max - horRange.min >= Chart.minZoomLevel && verRange.max - verRange.min >= Chart.minZoomLevel) {
                    var rect = new DataRect(horRange.min, verRange.min, horRange.max - horRange.min, verRange.max - verRange.min);

                    chart.update(chart._location, chart._size, rect);
                }

                Utilities.stopDefault(e);
                Utilities.stopEvent(e);
            }
        }
    }

    window.KeyboardNavigation = KeyboardNavigation;

}(window));