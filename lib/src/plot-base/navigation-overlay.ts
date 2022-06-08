import {ChartRenderableItem, RenderableItem} from "../core";
import {NumericPoint, Size} from "../model";
import Konva from "konva";
import {Cursor} from "../common";

export class NavigationOverlay {

  private location: NumericPoint;
  private size: Size;
  private container: HTMLElement;

  private eventTarget: EventTarget;

  private prevPoint: NumericPoint | undefined;
  private prevTouchesArray: Array<any> | undefined;
  private isMouseDown: boolean;

  private navigationShape: Konva.Shape;

  constructor(location: NumericPoint, size: Size, container: HTMLElement) {

    this.location = location;
    this.size = size;
    this.container = container;

    this.isMouseDown = false;

    this.eventTarget = new EventTarget();

    let navigationLayer = this;

    this.getRenderer()?.getContainer()

    this.navigationShape = new Konva.Shape({
      fill: "rgba(255, 255, 255, 0)",
      stroke: "rgba(255, 255, 255, 0)",
      sceneFunc: function (context, shape) {
        let location = navigationLayer.location;
        let size = navigationLayer.size;
        context.beginPath();
        context.moveTo(location.x, location.y);
        context.lineTo(location.x + size.width, location.y);
        context.lineTo(location.x + size.width, location.y + size.height);
        context.lineTo(location.x, location.y + size.height);
        context.closePath();
        context.fill();
        context.stroke();
      }
    });

    this.navigationShape.on("mousedown touchstart", function (e) {
      let originalEvent = e.evt;
        if (originalEvent.touches) {
          if (originalEvent.touches.length == 1) {
            let touch = originalEvent.targetTouches[0];
            navigationLayer.prevPoint = new NumericPoint(
              touch.pageX - navigationLayer.location.x,
              touch.pageY - navigationLayer.location.y);
          }
          else if (originalEvent.touches.length == 2) {

            let touchArray = [];

            for (let touch of originalEvent.touches) {
              touchArray.push(new NumericPoint(touch.pageX, touch.pageY));
            }
            navigationLayer.prevTouchesArray = touchArray;
          }
        }
        else {
          originalEvent.preventDefault();

          navigationLayer.getRenderer()?.setCursor(Cursor.Move);

          let prevPoint = new NumericPoint(originalEvent.pageX, originalEvent.pageY);
          prevPoint.x -= navigationLayer.location.x;
          prevPoint.y -= navigationLayer.location.y;

          navigationLayer.prevPoint = prevPoint;

          navigationLayer.isMouseDown = true

          let renderer = navigationLayer.getRenderer();

          let container = renderer?.getContainer();
          $(container!).focusin();

          if (_ChartNavigations7203439c19e24470a7bd6155c3a41b79 != undefined) {
            for (let i = 0; i < _ChartNavigations7203439c19e24470a7bd6155c3a41b79.length; i++) {
              let keyboardNavigation = _ChartNavigations7203439c19e24470a7bd6155c3a41b79[i];
              let chart = keyboardNavigation._chart;
              if (chart._navigationLayer != undefined) {
                if (chart._navigationLayer != navigationLayer) {
                  let chartNavigationLayer = chart._navigationLayer;
                  if (chartNavigationLayer.renderer != undefined) {
                    let container2 = chartNavigationLayer.renderer.getContainer();
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
        let navigationLayer = this.navigationLayer;
        navigationLayer._isMouseDown = false;
        navigationLayer._prevPoint = null;
        navigationLayer.getRenderer().setCursor(Cursor.Auto);
      }
      else {
        if (e.touches.length == 0) {
          let navigationLayer = this.navigationLayer;
          navigationLayer._isMouseDown = false;
          navigationLayer._prevPoint = null;
          navigationLayer._prevTouches = null;
        }
        else if (e.touches.length == 1) {
          let touch = event.targetTouches[0];
          let navigationLayer = this.navigationLayer;
          navigationLayer._prevPoint = new NumericPoint(
            touch.pageX - navigationLayer.location.x,
            touch.pageY - navigationLayer.location.y);
        }
      }
    });
    this._shape.on("mouseout", function (e) {
      let navigationLayer = this.navigationLayer;
      navigationLayer._isMouseDown = false;
      navigationLayer._prevPoint = null;

      navigationLayer.getRenderer().setCursor(Cursor.Auto);
    });
    this._shape.on("mousemove", function (e) {
      let navigationLayer = this.navigationLayer;
      if (e.touches) {
        e.preventDefault();
        if (e.touches.length == 1) {
          let navigationLayer = this.navigationLayer;
          let touch = e.touches[0];
          let curPoint = new NumericPoint(touch.pageX, touch.pageY);

          curPoint.x -= navigationLayer.location.x;
          curPoint.y -= navigationLayer.location.y;

          let prevPoint = navigationLayer._prevPoint;

          let deltaX = curPoint.x - prevPoint.x;
          let deltaY = curPoint.y - prevPoint.y;

          navigationLayer.eventTarget.fire(new DragEvent(deltaX, deltaY));

          navigationLayer._prevPoint = curPoint;
        }
        else if (e.touches.length == 2) {

          let navigationLayer = this.navigationLayer;

          if (navigationLayer._prevTouches != null) {
            let t0 = e.touches[0];
            let t1 = e.touches[1];

            let curTouch1 = new NumericPoint(t0.pageX, t0.pageY);
            let curTouch2 = new NumericPoint(t1.pageX, t1.pageY);

            let prevTouch1 = navigationLayer._prevTouches[0];
            let prevTouch2 = navigationLayer._prevTouches[1];

            let minX = Math.min(prevTouch1.x, prevTouch2.x);
            let minY = Math.min(prevTouch1.y, prevTouch2.y);

            let maxX = Math.max(prevTouch1.x, prevTouch2.x);
            let maxY = Math.max(prevTouch1.y, prevTouch2.y);

            let prevRect = new DataRect(minX, minY, maxX - minX, maxY - minY);

            minX = Math.min(curTouch1.x, curTouch2.x);
            minY = Math.min(curTouch1.y, curTouch2.y);

            maxX = Math.max(curTouch1.x, curTouch2.x);
            maxY = Math.max(curTouch1.y, curTouch2.y);

            let curRect = new DataRect(minX, minY, maxX - minX, maxY - minY);

            navigationLayer.eventTarget.fire(new MultitouchZoomEvent(prevRect, curRect));
          }

          let touches = [];

          for (let i = 0; i < e.touches.length; i++) {
            let touch = e.touches[i];
            touches.push(new NumericPoint(touch.pageX, touch.pageY));
          }

          navigationLayer._prevTouches = touches;
        }
      }
      else {
        if (navigationLayer._isMouseDown) {
          let prevPoint = navigationLayer._prevPoint;
          let curPoint = new NumericPoint(e.pageX, e.pageY);

          curPoint.x -= navigationLayer.location.x;
          curPoint.y -= navigationLayer.location.y;

          let deltaX = curPoint.x - prevPoint.x;
          let deltaY = curPoint.y - prevPoint.y;

          navigationLayer.eventTarget.fire(new DragEvent(deltaX, deltaY));

          navigationLayer._prevPoint = curPoint;
        }
      }
    });

    this._shape.navigationLayer = this;
  }

}

    NavigationOverlay.prototype = new RenderableItem();

    let p = NavigationOverlay.prototype;

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
        let navigationLayer = this.navigationLayer9c2ee650704442b3a93db55ac24f0c5d;
        navigationLayer._isMouseDown = false;
        navigationLayer._prevPoint = null;
        $(navigationLayer.getRenderer().getStage().getLayer('navigationLayer').canvas).css('cursor', 'auto');
    }

    p.attachBase = p.attach;

    p.attach = function (renderer) {
        this.attachBase(renderer);
        let stage = renderer.getStage();
        let layer = stage.getLayer('navigationLayer');
        layer.add(this._shape);

        let container = stage.getContainer();
        container.navigationLayer9c2ee650704442b3a93db55ac24f0c5d = this;

        //Using mouse wheel jquery plugin for handling mouse wheel.
        $(container).mousewheel(function (objEvent, delta) {
            let container = this.navigationLayer9c2ee650704442b3a93db55ac24f0c5d;
            container.eventTarget.fire(new ScrollEvent(delta));
          EventUtils.stopDefault(objEvent);
            EventUtils.stopEvent(objEvent);
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
        let stage = renderer.getStage();
        let layer = stage.getLayer('navigationLayer');
        layer.remove(this._shape);

        stage.off("mouseout", this._mouseOutFromShape);

        let container = stage.getContainer();
        $(container).unmousewheel();
        $(container).unbind('focusout', this._onDocumentMouseDown);
        container.navigationLayer9c2ee650704442b3a93db55ac24f0c5d = null;

        $(document).unbind('mousedown');
    }

    p.hasDirtyLayers = function () {
        return this._isDirty;
    }

    p.markDirty = function () {
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

    window.NavigationLayer = NavigationOverlay;
}(window));
