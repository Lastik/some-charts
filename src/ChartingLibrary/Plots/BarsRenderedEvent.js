/// <reference path="EventBase.js" />

(function (window) {

    var BarsRenderedEvent = function (offsetX, columnWidth) {
        /// <summary>Creates event after bars rendering.</summary>
        /// <param name="offsetX" type="Number">X offset (from renderer left bound) of bars on screen.</param>
        /// <param name="columnWidth" type="Number">Width of bars with margin on screen.</param>
        this.offsetX = offsetX;
        this.columnWidth = columnWidth;
        this.type = "barsRendered";
    }

    var p = BarsRenderedEvent.prototype;

    p.offsetX = 0;
    p.columnWidth = 0;
    p.type = null;

    window.BarsRenderedEvent = BarsRenderedEvent;

}(window));