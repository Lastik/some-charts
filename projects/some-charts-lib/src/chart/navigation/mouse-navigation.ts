﻿import {KeyboardNavigationsFactory} from "./keyboard";
import {ChartContent} from "../chart-content";
import {Chart} from "../chart";
import {DataRect, NumericDataRect, NumericPoint, NumericRange, Size} from "../../index";
import {Renderer} from "../../renderer";
import * as $ from 'jquery'

export class MouseNavigation extends ChartContent(Object) {

  private location: NumericPoint;
  private size: Size;

  private eventTarget: EventTarget;
  private prevPoint: NumericPoint | undefined;
  private prevTouches: Array<any> | undefined;
  private isMouseDown: boolean;

  private renderer?: Renderer = undefined;
  private container: JQuery | undefined;

  private readonly onMouseDownTouchStartHandler: (event: JQuery.Event) => void;
  private readonly onMouseUpTouchEndHandler: (event: JQuery.Event) => void;
  private readonly onMouseOutHandler: (event: JQuery.Event) => void;
  private readonly onMouseMoveHandler: (event: JQuery.Event) => void;
  private readonly onMouseWheelHandler: (event: JQuery.Event) => void;
  private readonly onMouseDoubleClickHandler: (event: JQuery.Event) => void;

  constructor(location: NumericPoint, size: Size,
              private keyboardNavigationsFactory: KeyboardNavigationsFactory = KeyboardNavigationsFactory.Instance ) {

    super();
    this.location = location;
    this.size = size;
    this.isMouseDown = false;
    this.eventTarget = new EventTarget();

    this.onMouseDownTouchStartHandler = (event: JQuery.Event) => {
      this.onMouseDownTouchStart.call(this, event);
    }

    this.onMouseUpTouchEndHandler = (event: JQuery.Event) => {
      this.onMouseUpTouchEnd.call(this, event);
    }

    this.onMouseOutHandler = (event: JQuery.Event) => {
      this.onMouseOut.call(this, event);
    }

    this.onMouseMoveHandler = (event: JQuery.Event) => {
      this.onMouseMove.call(this, event);
    }

    this.onMouseWheelHandler = (event: JQuery.Event)=>{
      this.onMouseWheel.call(this, event)
    }

    this.onMouseDoubleClickHandler = (event: JQuery.Event) => {
      this.onMouseDoubleClick.call(this, event)
    }
  }

  public update(location: NumericPoint, size: Size){
    this.location = location;
    this.size = size;
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
          this.prevTouches = touchArray;
        }
      } else {
        event.preventDefault();

        this.container?.addClass('sc-renderer-move');

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
      this.container?.removeClass('sc-renderer-move');
    } else {
      if (e.touches.length == 0) {
        this.isMouseDown = false;
        this.prevPoint = undefined;
        this.prevTouches = undefined;
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
    this.container?.removeClass('sc-renderer-move');
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
        if (this.prevTouches != null) {
          let t0 = e.touches[0];
          let t1 = e.touches[1];

          let curTouch1 = new NumericPoint(t0.pageX, t0.pageY);
          let curTouch2 = new NumericPoint(t1.pageX, t1.pageY);

          let prevTouch1 = this.prevTouches[0];
          let prevTouch2 = this.prevTouches[1];

          let minX = Math.min(prevTouch1.x, prevTouch2.x);
          let minY = Math.min(prevTouch1.y, prevTouch2.y);

          let maxX = Math.max(prevTouch1.x, prevTouch2.x);
          let maxY = Math.max(prevTouch1.y, prevTouch2.y);

          let prevRect = new NumericDataRect(minX, maxX, minY, maxY);

          minX = Math.min(curTouch1.x, curTouch2.x);
          minY = Math.min(curTouch1.y, curTouch2.y);

          maxX = Math.max(curTouch1.x, curTouch2.x);
          maxY = Math.max(curTouch1.y, curTouch2.y);

          let curRect = new NumericDataRect(minX, maxX, minY, maxY);

          this.handleMultitouchZooming(prevRect, curRect);
        }

        let touches = [];

        for (let i = 0; i < e.touches.length; i++) {
          let touch = e.touches[i];
          touches.push(new NumericPoint(touch.pageX, touch.pageY));
        }

        this.prevTouches = touches;
      }
    } else {
      if (this.isMouseDown && this.prevPoint && e.pageX && e.pageY) {
        let curPoint = new NumericPoint(e.pageX - this.location.x, e.pageY - this.location.y);
        this.handleDragging(curPoint.x - this.prevPoint.x, curPoint.y - this.prevPoint.y)
        this.prevPoint = curPoint;
      }
    }
  }

  protected onMouseWheel(e: JQuery.Event){
    this.handleScrollEvent((e as any).originalEvent.wheelDelta);
    e.preventDefault();
  }

  protected onMouseDoubleClick(e: JQuery.Event) {
    if (this.chart) {
      this.chart.fitToView();
    }
  }

  private handleDragging(pixelDeltaX: number, pixelDeltaY: number) {
    if (this.chart) {
      let horizontalRange = this.chart.visibleRectAsNumeric.getHorizontalRange();
      let verticalRange = this.chart.visibleRectAsNumeric.getVerticalRange();

      let plotSize = this.chart.getPlotSize();

      let dataDeltaX = pixelDeltaX * (horizontalRange.getLength() / plotSize.width);
      let dataDeltaY = pixelDeltaY * (verticalRange.getLength() / plotSize.height);

      let newHorizontalRange = horizontalRange.withShift(-dataDeltaX);
      let newVerticalRange = verticalRange.withShift(dataDeltaY);

      this.chart.updateNumeric(
        new NumericDataRect(newHorizontalRange.min, newHorizontalRange.max, newVerticalRange.min, newVerticalRange.max),
        true
      );
    }
  }

  private handleMultitouchZooming(prevPixRect: NumericDataRect, curPixRect: NumericDataRect) {
    if(this.chart) {
      let plotSize = this.chart.getPlotSize();

      let horizontalRange = this.chart.visibleRectAsNumeric.getHorizontalRange();
      let verticalRange = this.chart.visibleRectAsNumeric.getVerticalRange();

      let propX = horizontalRange.getLength() / plotSize.width;
      let propY = verticalRange.getLength() / plotSize.height

      let leftTopDeltaX = -(curPixRect.minX - prevPixRect.minX) * propX;
      let leftTopDeltaY = (curPixRect.minY - prevPixRect.minY) * propY;

      let rightBottomDeltaX = -(curPixRect.maxX - prevPixRect.maxX) * propX;
      let rightBottomDeltaY = (curPixRect.maxY - prevPixRect.maxY) * propY;

      let newHorizontalRange = new NumericRange(horizontalRange.min + leftTopDeltaX, horizontalRange.max + rightBottomDeltaX);
      let newVerticalRange = new NumericRange(verticalRange.min + rightBottomDeltaY, verticalRange.max + leftTopDeltaY);

      let dataRange = new NumericDataRect(newHorizontalRange.min, newHorizontalRange.max, newVerticalRange.min, newVerticalRange.max);

      this.chart.updateNumeric(dataRange, true);
    }
  };

  private handleScrollEvent(delta: number){
    if(this.chart) {
      let horRange = this.chart.visibleRectAsNumeric.getHorizontalRange();
      let verRange = this.chart.visibleRectAsNumeric.getVerticalRange();

      let zoomCoeff = 0.015;
      let sign = delta > 0 ? 1 : -1;

      let deltaX = horRange.getLength() * zoomCoeff * sign;
      let deltaY = verRange.getLength() * zoomCoeff * sign;

      let newHorRange = new NumericRange(horRange.min + deltaX, horRange.max - deltaX);
      let newVerRange = new NumericRange(verRange.min + deltaY, verRange.max - deltaY);

      if (newHorRange.max - newHorRange.min >= 1e-8 && newVerRange.max - newVerRange.min >= 1e-8) {
        this.chart.updateNumeric(
          new NumericDataRect(newHorRange.min, newHorRange.max, newVerRange.min, newVerRange.max),
          true);
      }
    }
  }

  /**
   * Binds mouse navigation to the chart.
   * @param {Chart} chart - Chart, this navigation is bound to.
   */
  override placeOnChart(chart?: Chart) {
    super.placeOnChart(chart);
    if(chart) {
      this.renderer = chart.renderer;
      this.container = $(this.renderer!.getContainer());

      this.container.on('mousedown touchstart', this.onMouseDownTouchStartHandler);
      this.container.on('mouseup touchend', this.onMouseUpTouchEndHandler);
      this.container.on('mouseout', this.onMouseOutHandler);
      this.container.on('mousemove', this.onMouseMoveHandler);
      this.container.on('mousewheel', this.onMouseWheelHandler);
      this.container.on('dblclick', this.onMouseDoubleClickHandler)
    }
  }

  /**
   * Unbinds mouse navigation from the chart.
   */
  override removeFromChart() {
    super.removeFromChart();
    if(this.container) {
      this.container.off('mousedown touchstart', this.onMouseDownTouchStartHandler);
      this.container.off('mouseup touchend', this.onMouseUpTouchEndHandler);
      this.container.off('mouseout', this.onMouseOutHandler);
      this.container.off('mousemove', this.onMouseMoveHandler);
      this.container.off('mousewheel', this.onMouseWheelHandler)
      this.container.off('dblclick', this.onMouseDoubleClickHandler)
    }
    this.renderer = undefined;
    this.container = undefined;
  }
}
