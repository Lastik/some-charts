import {ChartContent} from "../../chart-content";
import {Chart} from "../../chart";
import {DataRect, IDisposable, NumericDataRect, NumericRange} from "../../../index";
import {KeyboardNavigationsFactory} from "./keyboard-navigations-factory";
import * as $ from 'jquery'

export class KeyboardNavigation extends ChartContent(Object) implements IDisposable {
  private readonly _id: number;

  private isHostFocused: boolean;

  private host: HTMLDivElement | undefined;

  private readonly onKeyDownHandler: (event: JQuery.Event) => void;

  public get id(){
    return this._id;
  }

  public constructor(id: number, private keyboardNavigationsFactory: KeyboardNavigationsFactory = KeyboardNavigationsFactory.Instance ) {
    super();
    this._id = id;
    this.isHostFocused = false;

    let self = this;

    this.onKeyDownHandler = (event: JQuery.Event) => {
      self.onKeyDown.call(self, event);
    }
  }

  dispose(): void {
    this.keyboardNavigationsFactory?.removeReference(this);
  }

  /**
   * Attaches keyboard navigation to chart.
   * @param {Chart} chart - Target chart.
   * */
  override placeOnChart(chart?: Chart) {
    super.placeOnChart(chart);
    if(chart) {
      let chartRenderer = chart.getRenderer();
      if (!chartRenderer) {
        throw new Error(`Chart has no attached renderer!`);
      }
      this.host = chartRenderer.getContainer();

      let body = $('body');

      body.on('keydown', this.onKeyDownHandler);
    }
  }

  /**
   * Detaches keyboard navigation from chart.
   * */
  override removeFromChart() {
    if(this.host) {
      let body = $('body');
      body.off('keydown', this.onKeyDownHandler);
      this.host = undefined;
    }
    super.removeFromChart();
  }

  protected onKeyDown(e: JQuery.Event) {
    if(this.chart && this.host && this.isHostFocused){

      let horizontalRange = this.chart!.visibleRectAsNumeric.getHorizontalRange();
      let verticalRange = this.chart!.visibleRectAsNumeric.getVerticalRange();

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

      if (horizontalRange.max - horizontalRange.min >= this.chart.minZoomLevel && verticalRange.max - verticalRange.min >= this.chart.minZoomLevel) {
        let newChartDataRect = new NumericDataRect(horizontalRange.min, verticalRange.min, horizontalRange.max - horizontalRange.min, verticalRange.max - verticalRange.min);
        this.chart.update(newChartDataRect,
          true);
      }

      e.preventDefault();
      e.stopPropagation();
    }
  }

  focusIn(){
    this.isHostFocused = true;
  }

  focusOut(){
    this.isHostFocused = false;
  }
}
