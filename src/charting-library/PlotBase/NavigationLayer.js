/// <reference path="../Common/EventTarget.js" />
/// <reference path="../../Utils/kinetic-v3.5.js" />
/// <reference path="../../Utils/excanvas.js" />
/// <reference path="../Core/Renderer.js" />
/// <reference path="../Core/RenderableItem.js" />
/// <reference path="TicksGenerator.js" />
/// <reference path="../Common/Range.js" />
/// <reference path="../Common/DataTransform.js" />
/// <reference path="../Common/Size.js" />
/// <reference path="../Common/Point.js" />
/// <reference path="../Common/DragEvent.js" />
/// <reference path="../common/multitouchzoomevent.js" />
/// <reference path="../Common/EventBase.js" />
/// <reference path="../../Utils/jquery.mousewheel.min.js" />
/// <reference path="../common/utilities.js" />
/// <reference path="NumericAxis.js" />

(function (window) {

    var NavigationLayer = function (location, size) {
        /// <summary>Creates navigation layer. Navigation layer catches mouse events and transfers them to chart.</summary>
        RenderableItem.call(this);

        this.location = location;
        this.size = size;

        this.eventTarget = new EventTarget();

        this._shape = new Kinetic.Shape({
            drawFunc: function () {
                var context = this.getContext();
                var navigationLayer = this.navigationLayer;
                var location = navigationLayer.location;
                var size = navigationLayer.size;
                context.beginPath();
                context.strokeStyle = "rgba(255, 255, 255, 0)";
                context.fillStyle = "rgba(255, 255, 255, 0)";
                context.moveTo(location.x, location.y);
                context.lineTo(location.x + size.width, location.y);
                context.lineTo(location.x + size.width, location.y + size.height);
                context.lineTo(location.x, location.y + size.height);
                context.closePath();
                context.fill();
                context.stroke();
            }
        });

        this._shape.on("mousedown touchstart", function (e) {
            if (e.touches) {
                if (e.touches.length == 1) {
                    var touch = event.targetTouches[0];
                    var navigationLayer = this.navigationLayer;
                    navigationLayer._prevPoint = new Point(
                    touch.pageX - navigationLayer.location.x,
                    touch.pageY - navigationLayer.location.y);
                }
                else if (e.touches.length == 2) {

                    var navigationLayer = this.navigationLayer;

                    var touchArray = [];

                    for (var i = 0; i < e.touches.length; i++) {
                        var t = e.touches[i];
                        touchArray.push(new Point(t.pageX, t.pageY));
                    }
                    navigationLayer._prevTouches = touchArray;
                }
            }
            else {
                e.preventDefault();

                var navigationLayer = this.navigationLayer;

                $(navigationLayer.getRenderer().getStage().getLayer('navigationLayer').canvas).css('cursor', 'move');

                var prevPoint = new Point(e.pageX, e.pageY);
                prevPoint.x -= navigationLayer.location.x;
                prevPoint.y -= navigationLayer.location.y;

                navigationLayer._prevPoint = prevPoint;

                navigationLayer._isMouseDown = true

                var renderer = navigationLayer._renderer;

                var stage = renderer.getStage();
                var container = stage.getContainer();
                $(container).focusin();

                if (_ChartNavigations7203439c19e24470a7bd6155c3a41b79 != undefined) {
                    for (var i = 0; i < _ChartNavigations7203439c19e24470a7bd6155c3a41b79.length; i++) {
                        var keyboardNavigation = _ChartNavigations7203439c19e24470a7bd6155c3a41b79[i];
                        var chart = keyboardNavigation._chart;
                        if (chart._navigationLayer != undefined) {
                            if (chart._navigationLayer != navigationLayer) {
                                var chartNavigationLayer = chart._navigationLayer;
                                if (chartNavigationLayer._renderer != undefined) {
                                    var container2 = chartNavigationLayer._renderer.getContainer();
                                    if (container2 != container) {
                                        $(container2).focusout();
                                    }
                                }
                            }
                        }
                    }
                }

                e.cancelBubble = true;
            }
        }
            );
        this._shape.on("mouseup touchend", function (e) {
            if (!e.touches) {
                var navigationLayer = this.navigationLayer;
                navigationLayer._isMouseDown = false;
                navigationLayer._prevPoint = null;
                $(navigationLayer.getRenderer().getStage().getLayer('navigationLayer').canvas).css('cursor', 'auto');
            }
            else {
                if (e.touches.length == 0) {
                    var navigationLayer = this.navigationLayer;
                    navigationLayer._isMouseDown = false;
                    navigationLayer._prevPoint = null;
                    navigationLayer._prevTouches = null;
                }
                else if (e.touches.length == 1) {
                    var touch = event.targetTouches[0];
                    var navigationLayer = this.navigationLayer;
                    navigationLayer._prevPoint = new Point(
                    touch.pageX - navigationLayer.location.x,
                    touch.pageY - navigationLayer.location.y);
                }
            }
        });
        this._shape.on("mouseout", function (e) {
            var navigationLayer = this.navigationLayer;
            navigationLayer._isMouseDown = false;
            navigationLayer._prevPoint = null;

            $(navigationLayer.getRenderer().getStage().getLayer('navigationLayer').canvas).css('cursor', 'auto');
        });
        this._shape.on("mousemove", function (e) {
            var navigationLayer = this.navigationLayer;
            if (e.touches) {
                e.preventDefault();
                if (e.touches.length == 1) {
                    var navigationLayer = this.navigationLayer;
                    var touch = e.touches[0];
                    var curPoint = new Point(touch.pageX, touch.pageY);

                    curPoint.x -= navigationLayer.location.x;
                    curPoint.y -= navigationLayer.location.y;

                    var prevPoint = navigationLayer._prevPoint;

                    var deltaX = curPoint.x - prevPoint.x;
                    var deltaY = curPoint.y - prevPoint.y;

                    navigationLayer.eventTarget.fire(new DragEvent(deltaX, deltaY));

                    navigationLayer._prevPoint = curPoint;
                }
                else if (e.touches.length == 2) {

                    var navigationLayer = this.navigationLayer;

                    if (navigationLayer._prevTouches != null) {
                        var t0 = e.touches[0];
                        var t1 = e.touches[1];

                        var curTouch1 = new Point(t0.pageX, t0.pageY);
                        var curTouch2 = new Point(t1.pageX, t1.pageY);

                        var prevTouch1 = navigationLayer._prevTouches[0];
                        var prevTouch2 = navigationLayer._prevTouches[1];

                        var minX = Math.min(prevTouch1.x, prevTouch2.x);
                        var minY = Math.min(prevTouch1.y, prevTouch2.y);

                        var maxX = Math.max(prevTouch1.x, prevTouch2.x);
                        var maxY = Math.max(prevTouch1.y, prevTouch2.y);

                        var prevRect = new DataRect(minX, minY, maxX - minX, maxY - minY);

                        minX = Math.min(curTouch1.x, curTouch2.x);
                        minY = Math.min(curTouch1.y, curTouch2.y);

                        maxX = Math.max(curTouch1.x, curTouch2.x);
                        maxY = Math.max(curTouch1.y, curTouch2.y);

                        var curRect = new DataRect(minX, minY, maxX - minX, maxY - minY);

                        navigationLayer.eventTarget.fire(new MultitouchZoomEvent(prevRect, curRect));
                    }

                    var touches = [];

                    for (var i = 0; i < e.touches.length; i++) {
                        var touch = e.touches[i];
                        touches.push(new Point(touch.pageX, touch.pageY));
                    }

                    navigationLayer._prevTouches = touches;
                }
            }
            else {
                if (navigationLayer._isMouseDown) {
                    var prevPoint = navigationLayer._prevPoint;
                    var curPoint = new Point(e.pageX, e.pageY);

                    curPoint.x -= navigationLayer.location.x;
                    curPoint.y -= navigationLayer.location.y;

                    var deltaX = curPoint.x - prevPoint.x;
                    var deltaY = curPoint.y - prevPoint.y;

                    navigationLayer.eventTarget.fire(new DragEvent(deltaX, deltaY));

                    navigationLayer._prevPoint = curPoint;
                }
            }
        });

        this._shape.navigationLayer = this;
    }

    NavigationLayer.prototype = new RenderableItem();

    var p = NavigationLayer.prototype;

    //Inner shape, which catches events.
    p._shape = null;

    p.size = null;
    p.location = null;

    p._isDirty = false;

    p.eventTarget = null;

    /****Navigation state***/
    p._prevPoint = null;
    p._prevTouches = null;
    p._isMouseDown = false;
    /***********************/

    p.onMove = null;
    p.onMultitouchZoom = null;

    p.update = function (location, size) {
        /// <summary>Updates navigation layer's location and size.</summary>
        /// <param name="location" type="Point">Location on renderer.</param>
        /// <param name="size" type="Size">Size on renderer.</param>
        this.location = location;
        this.size = size;

        this._isDirty = true;
    }

    p._mouseOutFromShape = function () {
        var navigationLayer = this.navigationLayer9c2ee650704442b3a93db55ac24f0c5d;
        navigationLayer._isMouseDown = false;
        navigationLayer._prevPoint = null;
        $(navigationLayer.getRenderer().getStage().getLayer('navigationLayer').canvas).css('cursor', 'auto');
    }

    p.attachBase = p.attach;

    p.attach = function (renderer) {
        this.attachBase(renderer);
        var stage = renderer.getStage();
        var layer = stage.getLayer('navigationLayer');
        layer.add(this._shape);

        var container = stage.getContainer();
        container.navigationLayer9c2ee650704442b3a93db55ac24f0c5d = this;

        //Using mouse wheel jquery plugin for handling mouse wheel.
        $(container).mousewheel(function (objEvent, delta) {
            var container = this.navigationLayer9c2ee650704442b3a93db55ac24f0c5d;
            container.eventTarget.fire(new ScrollEvent(delta));
            Utilities.stopDefault(objEvent);
            Utilities.stopEvent(objEvent);
        });

        $(document).mousedown(container, this._onDocumentMouseDown);

        stage.on("mouseout", this._mouseOutFromShape, false);
    }

    p._onDocumentMouseDown = function (o) {
        $(o.data).focusout();
    }

    p.detachBase = p.detach;
    p.detach = function (renderer) {
        this.detachBase(renderer);
        var stage = renderer.getStage();
        var layer = stage.getLayer('navigationLayer');
        layer.remove(this._shape);

        stage.off("mouseout", this._mouseOutFromShape);

        var container = stage.getContainer();
        $(container).unmousewheel();
        $(container).unbind('focusout', this._onDocumentMouseDown);
        container.navigationLayer9c2ee650704442b3a93db55ac24f0c5d = null;

        $(document).unbind('mousedown');
    }

    p.hasDirtyLayers = function () {
        return this._isDirty;
    }

    p.updateIsDirty = function () {
        this._isDirty = false;
    }

    p.getDirtyLayers = function () {
        if (this._isDirty)
            return new Array("navigationLayer");
        else
            return null;
    }

    p.getDependantLayers = function () {
        return new Array("navigationLayer");
    }

    window.NavigationLayer = NavigationLayer;
}(window));
