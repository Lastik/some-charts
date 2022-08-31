import {ChartApi} from "./api";

export function ChartContent<ChartContentItemType, TBase extends abstract new (...args: any[]) => any>(Base: TBase) {
  abstract class Mixin extends Base {
    _chart?: ChartApi<ChartContentItemType>;

    /**
     * Places this item on the chart.
     * @param {ChartApi | undefined} chart - Chart where to place this item.
     */
    placeOnChart(chart?: ChartApi<ChartContentItemType>) {
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
    get chart(): ChartApi<ChartContentItemType> | undefined {
      return this._chart;
    }
  }

  return Mixin;
}
