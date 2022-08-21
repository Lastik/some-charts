import {Chart} from "./chart";

export function ChartContent<TBase extends abstract new (...args: any[]) => any>(Base: TBase) {
  abstract class Mixin extends Base {
    _chart?: Chart<any, any, any>;

    /**
     * Places this item on the chart.
     * @param {Chart | undefined} chart - Chart where to place this item.
     */
    placeOnChart(chart?: Chart<any, any, any>) {
      this._chart = chart;
    }

    /**
     * Removes this item from the chart.
     */
    removeFromChart() {
      this._chart = undefined;
    }

    /**
     * Returns related chart
     * @returns {Chart} chart.
     */
    get chart(): Chart<any, any, any> | undefined {
      return this._chart;
    }
  }

  return Mixin;
}
