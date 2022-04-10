/// <reference path="EventBase.js" />

(function (window) {

    var ScrollEvent = function (delta) {
        /// <summary>Creates event of chart scrolling.</summary>
        /// <param name="delta" type="Number">Scroll delta.</param>
        this.delta = delta;
        this.type = "scrolling";
    }

    var p = ScrollEvent.prototype;

    p.delta = 0;
    p.type = null;

    window.ScrollEvent = ScrollEvent;

}(window));