import {ChartContent} from "./chart-content"
import {RenderableItem} from "../renderer";
import {Chart} from "./chart";

/**
 * Implementation of RenderableItem class drawn on chart.
 */
export abstract class ChartRenderableItem extends ChartContent(RenderableItem) {

  override placeOnChart(chart?: Chart) {
    super.placeOnChart(chart);
    this.chart?.addContentItem(this);
  }

  override removeFromChart() {
    this.chart?.removeContentItem(this);
    super.removeFromChart();
  }
}
