/// <reference path="EventBase.js" />

(function (window) {

    var MultitouchZoomEvent = function (prevRect, curRect) {
        /// <summary>Represents event, which will occur while numtitouch navigatin.</summary>
        /// <param name="prevRect" type="DataRect">Previous selected rectange on screen.</param>
        /// <param name="curRect" type="DataRect">Current selecyed rectangle on screen.</param>
        this.prevRect = prevRect;
        this.curRect = curRect;
        this.type = "multitouchZooming";
    }

    var p = MultitouchZoomEvent.prototype;

    p.prevRect = 0;
    p.curRect = 0;
    p.type = null;

    window.MultitouchZoomEvent = MultitouchZoomEvent;

}(window));