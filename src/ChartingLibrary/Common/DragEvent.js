/// <reference path="EventBase.js" />

(function (window) {

    var DragEvent = function (deltaX, deltaY) {
        /// <summary>Creates event of chart dragging.</summary>
        /// <param name="deltaX" type="Number">X cooridnate drag delta.</param>
        /// <param name="deltaY" type="Number">Y coordinate drag delta.</param>
        this.deltaX = deltaX;
        this.deltaY = deltaY;
        this.type = "dragging";
    }

    var p = DragEvent.prototype;

    p.deltaX = 0;
    p.deltaY = 0;
    p.type = null;

    window.DragEvent = DragEvent;

}(window));