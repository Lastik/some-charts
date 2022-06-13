import {Chart} from "../chart";
import {IDisposable} from "../../common";
import {inject} from "tsyringe";
import {KeyboardNavigationsFactory} from "./keyboard-navigations-factory";
import {DataRect, NumericRange} from "../../model";

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

  onKeyDown(e: JQuery.Event) {
    if(this.chart && this.host && this.isHostFocused){

      let horizontalRange = this.chart!.dataRect.getHorizontalRange();
      let verticalRange = this.chart!.dataRect.getVerticalRange();

      let horizontalDelta = horizontalRange.max - horizontalRange.min;
      let verticalDelta = verticalRange.max - verticalRange.min;

      let horizontalStep = horizontalDelta * 0.01;
      let verticalStep = verticalDelta * 0.01;

      switch (e.key) {
        case 'Down': // IE/Edge specific value
        case 'ArrowDown':
          verticalRange = verticalRange.withShift(-verticalStep);
          break;
        case 'Up': // IE/Edge specific value
        case 'ArrowUp':
          verticalRange = verticalRange.withShift(verticalStep);
          break;
        case 'Left': // IE/Edge specific value
        case 'ArrowLeft':
          horizontalRange = horizontalRange.withShift(-horizontalStep);
          break;
        case 'Right': // IE/Edge specific value
        case 'ArrowRight':
          horizontalRange = horizontalRange.withShift(horizontalStep);
          break;
        case '+':
          horizontalRange = new NumericRange(
            horizontalRange.min + horizontalStep,
            horizontalRange.max - horizontalStep);

          verticalRange = new NumericRange(
            verticalRange.min + verticalStep,
            verticalRange.max - verticalStep);
          break;
        case '-':
          horizontalRange = new NumericRange(
            horizontalRange.min - horizontalStep,
            horizontalRange.max + horizontalStep);

          verticalRange = new NumericRange(
            verticalRange.min - verticalStep,
            verticalRange.max + verticalStep);
          break;
      }

      if (horizontalRange.max - horizontalRange.min >= Chart.MinZoomLevel && verticalRange.max - verticalRange.min >= Chart.MinZoomLevel) {
        let newChartDataRect = new DataRect(horizontalRange.min, verticalRange.min, horizontalRange.max - horizontalRange.min, verticalRange.max - verticalRange.min);
        this.chart.update(this.chart.location, this.chart.size, newChartDataRect);
      }

      e.preventDefault();
      e.stopPropagation();
    }
  }

  onFocusIn(e: JQuery.Event){
    this.isHostFocused = true;
  }

  onFocusOut(e: JQuery.Event){
    this.isHostFocused = false;
  }
}
