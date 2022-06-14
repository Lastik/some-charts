import {ChartContent, RenderableItem, Renderer} from "../core";
import {DataRect, NumericPoint, NumericRange, Size} from "../model";
import {Cursor} from "../common";
import {inject} from "tsyringe";
import {KeyboardNavigationsFactory} from "./keyboard";
import {Chart} from "./chart";

export class MouseNavigation extends ChartContent(Object) {

  private location: NumericPoint;
  private size: Size;

  private eventTarget: EventTarget;
  private prevPoint: NumericPoint | undefined;
  private prevTouchesArray: Array<any> | undefined;
  private isMouseDown: boolean;

  private renderer?: Renderer = undefined;
  private container: JQuery | undefined;

  private readonly onMouseDownTouchStartHandler: (event: JQuery.Event) => void;
  private readonly onMouseUpTouchEndHandler: (event: JQuery.Event) => void;
  private readonly onMouseOutHandler: (event: JQuery.Event) => void;
  private readonly onMouseMoveHandler: (event: JQuery.Event) => void;

  constructor(location: NumericPoint, size: Size,
              @inject("KeyboardNavigationFactory") private keyboardNavigationsFactory?: KeyboardNavigationsFactory ) {

    super();
    this.location = location;
    this.size = size;
    this.isMouseDown = false;
    this.eventTarget = new EventTarget();

    let self = this;

    this.onMouseDownTouchStartHandler = (event: JQuery.Event) => {
      self.onMouseDownTouchStart.call(this, event);
    }

    this.onMouseUpTouchEndHandler = (event: JQuery.Event) => {
      self.onMouseUpTouchEnd.call(this, event);
    }

    this.onMouseOutHandler = (event: JQuery.Event) => {
      self.onMouseOut.call(this, event);
    }

    this.onMouseMoveHandler = (event: JQuery.Event) => {
      self.onMouseOut.call(this, event);
    }

  }

  protected onMouseDownTouchStart(event: JQuery.Event) {
    if(this.chart) {
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

        this.container?.addClass('fac-renderer-move');

        this.prevPoint = event.pageX && event.pageY ? new NumericPoint(
          event.pageX - this.location.x,
          event.pageY - this.location.y) : undefined;

        this.isMouseDown = true

        for (let keyboardNavigation of this.keyboardNavigationsFactory!.getAllNavigations()) {
          if(keyboardNavigation.chart?.id === this.chart.id){
            keyboardNavigation.focusIn();
          }
          else {
            keyboardNavigation.focusOut();
          }
        }

        event.bubbles = false;
      }
    }
  }

  protected onMouseUpTouchEnd(e: JQuery.Event) {
    if (!e.touches) {
      this.isMouseDown = false;
      this.prevPoint = undefined;
      this.container?.removeClass('fac-renderer-move');
    } else {
      if (e.touches.length == 0) {
        this.isMouseDown = false;
        this.prevPoint = undefined;
        this.prevTouchesArray = undefined;
      } else if (e.touches.length == 1 && e.targetTouches) {
        let touch = e.targetTouches[0];
        this.prevPoint = new NumericPoint(
          touch.pageX - this.location.x,
          touch.pageY - this.location.y);
      }
    }
  }

  protected onMouseOut(e: JQuery.Event) {
    this.isMouseDown = false;
    this.prevPoint = undefined;
    this.container?.removeClass('fac-renderer-move');
  }

  protected onMouseMove(e: JQuery.Event) {
    if (e.touches) {
      e.preventDefault();
      if (e.touches.length == 1) {
        let touch = e.touches[0];
        let curPoint = new NumericPoint(touch.pageX, touch.pageY);

        curPoint.x -= this.location.x;
        curPoint.y -= this.location.y;

        let prevPoint = this.prevPoint;

        if(prevPoint){
          let deltaX = curPoint.x - prevPoint.x;
          let deltaY = curPoint.y - prevPoint.y;

          this.handleDragging(-deltaX, deltaY)
          this.prevPoint = curPoint;
        }
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

          this.handleMultitouchZooming(prevRect, curRect);
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

  private handleDragging(pixelDeltaX: number, pixelDeltaY: number) {
    if (this.chart) {
      let horizontalRange = this.chart.dataRect.getHorizontalRange();
      let verticalRange = this.chart.dataRect.getVerticalRange();

      let plotSize = this.chart.getPlotSize();

      let dataDeltaX = pixelDeltaX * (horizontalRange.getLength() / plotSize.width);
      let dataDeltaY = pixelDeltaY * (verticalRange.getLength() / plotSize.height);

      let newHorizontalRange = horizontalRange.withShift(dataDeltaX);
      let newVerticalRange = verticalRange.withShift(dataDeltaY);

      this.chart.update(
        this.chart.location,
        this.chart.size,
        new DataRect(
          newHorizontalRange.min, newVerticalRange.min,
          newHorizontalRange.getLength(), newVerticalRange.getLength())
      );
    }
  }

  private handleMultitouchZooming(prevPixRect: DataRect, curPixRect: DataRect) {
    if(this.chart) {
      let plotSize = this.chart.getPlotSize();

      let horizontalRange = this.chart.dataRect.getHorizontalRange();
      let verticalRange = this.chart.dataRect.getVerticalRange();

      let propX = horizontalRange.getLength() / plotSize.width;
      let propY = verticalRange.getLength() / plotSize.height

      let leftTopDeltaX = -(curPixRect.minX - prevPixRect.minX) * propX;
      let leftTopDeltaY = (curPixRect.minY - prevPixRect.minY) * propY;

      let rightBottomDeltaX = -(curPixRect.maxX - prevPixRect.maxX) * propX;
      let rightBottomDeltaY = (curPixRect.maxY - prevPixRect.maxY) * propY;

      let dataRangeX = new NumericRange(horizontalRange.min + leftTopDeltaX, horizontalRange.max + rightBottomDeltaX);
      let dataRangeY = new NumericRange(verticalRange.min + rightBottomDeltaY, verticalRange.max + leftTopDeltaY);

      let dataRange = new DataRect(dataRangeX.min, dataRangeY.min, dataRangeX.getLength(), dataRangeY.getLength());

      this.chart.update(this.chart.location, this.chart.size, dataRange);
    }
  };

  this._navigationLayer.eventTarget.addListener("scrolling", function (event, state) {
    var chart = state;
    var delta = event.delta;
    chart.zoom(delta);
  }, this);

  /**
   * Binds mouse navigation to the chart.
   * @param {Chart} chart - Chart, this navigation is bound to.
   */
  override placeOnChart(chart?: Chart) {
    super.placeOnChart(chart);
    if(chart) {
      this.renderer = chart.getRenderer();
      this.container = $(this.renderer!.getContainer());

      this.container.on('mousedown touchstart', this.onMouseDownTouchStartHandler);
      this.container.on("mouseup touchend", this.onMouseUpTouchEndHandler);
      this.container.on("mouseout", this.onMouseOutHandler);
      this.container.on("mousemove", this.onMouseMoveHandler);
    }
  }

  /**
   * Unbinds mouse navigation from the chart.
   */
  override removeFromChart() {
    super.removeFromChart();
    if(this.container) {
      this.container.off('mousedown touchstart', this.onMouseDownTouchStartHandler);
      this.container.off("mouseup touchend", this.onMouseUpTouchEndHandler);
      this.container.off("mouseout", this.onMouseOutHandler);
      this.container.off("mousemove", this.onMouseMoveHandler);
    }
    this.renderer = undefined;
    this.container = undefined;
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
