import {RenderableItem} from "./renderable-item";
import {ChartContent} from "./chart-content"
import {Chart} from "./chart";

/**
 * Implementation of RenderableItem class drawn on chart.
 */
export abstract class ChartRenderableItem extends ChartContent(RenderableItem) {

  override placeOnChart(chart?: Chart<any, any, any>) {
    super.placeOnChart(chart);
    chart?.addContentItem(this);
  }

  override removeFromChart() {
    this.chart?.removeContentItem(this);
    super.removeFromChart();
  }
}
