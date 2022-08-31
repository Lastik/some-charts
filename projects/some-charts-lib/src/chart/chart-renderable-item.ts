import {ChartContent, ChartInterface} from "./chart-content"
import {RenderableItem} from "../renderer";

/**
 * Implementation of RenderableItem class drawn on chart.
 */
export abstract class ChartRenderableItem extends ChartContent(RenderableItem) {

  override placeOnChart(chart?: ChartInterface) {
    super.placeOnChart(chart);
    chart?.addContentItem(this);
  }

  override removeFromChart() {
    this.chart?.removeContentItem(this);
    super.removeFromChart();
  }
}
