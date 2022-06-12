import {EventUtils} from "../../services";
import {Chart} from "../chart";
import {IDisposable} from "../../common";
import {inject} from "tsyringe";
import {KeyboardNavigationsFactory} from "./keyboard-navigations-factory";

export class KeyboardNavigation implements IDisposable{
  private _id: number;

  private isHostFocused: boolean;

  private host: HTMLDivElement | undefined;
  private chart: Chart | undefined;

  private readonly onFocusInHandler: (event: JQuery.Event) => void;
  private readonly onFocusOutHandler: (event: JQuery.Event) => void;
  private readonly onKeyDownHandler: (event: JQuery.Event) => void;

  public get id(){
    return this._id;
  }

  public constructor(id: number, @inject("KeyboardNavigationFactory") private keyboardNavigationsFactory?: KeyboardNavigationsFactory ) {
    this._id = id;
    this.isHostFocused = false;

    let self = this;

    this.onFocusInHandler = (event: JQuery.Event) => {
      self.onFocusIn.call(this, event);
    }

    this.onFocusOutHandler = (event: JQuery.Event) => {
      self.onFocusOut.call(this, event);
    }

    this.onKeyDownHandler = (event: JQuery.Event) => {
      self.onKeyDown.call(this, event);
    }
  }

  dispose(): void {
    this.keyboardNavigationsFactory?.removeReference(this);
  }

  /**
   * Attaches keyboard navigation to chart.
   * @param {Chart} chart - Target chart.
   * */
  attach(chart: Chart) {
    let chartRenderer = chart.getRenderer();
    if(!chartRenderer){
      throw new Error(`Chart has no attached renderer!`);
    }
    this.host = chartRenderer.getContainer();
    this.chart = chart;

    let body = $('body');

    body.on('keydown', this.onKeyDownHandler);
    $(this.host).on('focusin', this.onFocusInHandler);
    $(this.host).on('focusout', this.onFocusOutHandler);
  }

  /**
   * Detaches keyboard navigation from chart.
   * */
  detach() {
    if(this.host && this.chart) {
      let body = $('body');
      body.off('keydown', this.onKeyDownHandler);
      $(this.host).off('focusin', this.onFocusInHandler);
      $(this.host).off('focusout', this.onFocusOutHandler);
      this.chart = undefined;
      this.host = undefined;
    }
  }

  dest

  p._host = null;
  p._chart = null;
  p._isHostFocused = false;

  p.onKeyDown = function (e) {
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

        EventUtils.stopDefault(e);
        EventUtils.stopEvent(e);
      }
    }
  }

  onFocusIn(e){
    this.isHostFocused = true;
  }

  onFocusOut(e){

  }
}
