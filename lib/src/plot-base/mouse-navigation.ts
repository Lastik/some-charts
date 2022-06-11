import {RenderableItem, Renderer} from "../core";
import {NumericPoint, Size} from "../model";
import {Cursor} from "../common";

export class MouseNavigation {

  private location: NumericPoint;
  private size: Size;

  private eventTarget: EventTarget;
  private prevPoint: NumericPoint | undefined;
  private prevTouchesArray: Array<any> | undefined;
  private isMouseDown: boolean;

  private renderer?: Renderer = undefined;
  private container: JQuery | undefined;

  constructor(location: NumericPoint, size: Size) {

    this.location = location;
    this.size = size;
    this.isMouseDown = false;
    this.eventTarget = new EventTarget();
  }

  /**
   * Attaches item the to renderer.
   * @param {Renderer} renderer - Renderer to use for item rendering.
   */
  attach(renderer: Renderer) {
    this.renderer = renderer;
    this.container = $(this.renderer.getContainer());
    this.container.on('mousedown touchstart', this.onMouseDownTouchStart);
    this.container.on("mouseup touchend", this.onMouseUpTouchEnd);
    this.container.on("mouseout", this.onMouseOut);
    this.container.on("mousemove", this.onMouseMove);
  }

  onMouseDownTouchStart(event: JQuery.Event) {
    if (event.touches && event.targetTouches) {
      if (event.touches.length == 1) {
        let touch = event.targetTouches[0];
        this.prevPoint = new NumericPoint(
          touch.pageX - this.location.x,
          touch.pageY - this.location.y);
      } else if (event.touches.length == 2) {
        let touchArray = [];
        for (let i = 0; i < event.touches.length; i++) {
          let touch = event.touches[i];
          touchArray.push(new NumericPoint(touch.pageX, touch.pageY));
        }
        this.prevTouchesArray = touchArray;
      }
    } else {
      event.preventDefault();

      this.container!.addClass('fac-renderer-move');

      this.prevPoint = event.pageX && event.pageY ? new NumericPoint(
        event.pageX - this.location.x,
        event.pageY - this.location.y) : undefined;

      this.isMouseDown = true

      $(this.container!).trigger('focusin');

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

      event.cancelBubble = true;
    }
  }

  onMouseUpTouchEnd(e: JQuery.Event) {
    if (!e.touches) {
      let navigationLayer = this.navigationLayer;
      navigationLayer._isMouseDown = false;
      navigationLayer._prevPoint = null;
      navigationLayer.getRenderer().setCursor(Cursor.Auto);
    } else {
      if (e.touches.length == 0) {
        let navigationLayer = this.navigationLayer;
        navigationLayer._isMouseDown = false;
        navigationLayer._prevPoint = null;
        navigationLayer._prevTouches = null;
      } else if (e.touches.length == 1) {
        let touch = event.targetTouches[0];
        let navigationLayer = this.navigationLayer;
        navigationLayer._prevPoint = new NumericPoint(
          touch.pageX - navigationLayer.location.x,
          touch.pageY - navigationLayer.location.y);
      }
    }
  }

  onMouseOut(e: JQuery.Event) {
    let navigationLayer = this.navigationLayer;
    navigationLayer._isMouseDown = false;
    navigationLayer._prevPoint = null;

    navigationLayer.getRenderer().setCursor(Cursor.Auto);
  }

  onMouseMove(e: JQuery.Event) {
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
      } else if (e.touches.length == 2) {

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
    } else {
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
  }

  /**
   * Detaches item the to renderer.
   */
  detach() {
    if(this.renderer && this.container) {
      this.container.off('mousedown touchstart', this.onMouseDownTouchStart);
      this.container.off("mouseup touchend", this.onMouseUpTouchEnd);
      this.container.off("mouseout", this.onMouseOut);
      this.container.off("mousemove", this.onMouseMove);
      this.renderer = undefined;
      this.container = undefined;
    }
  }
}


    MouseNavigation.prototype = new RenderableItem();

    let p = MouseNavigation.prototype;

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

    window.NavigationLayer = MouseNavigation;
}(window));
