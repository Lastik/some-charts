import {ChartContent} from "./chart-content"
import {RenderableItem} from "../renderer";
import {ChartApi} from "./api";

/**
 * Implementation of RenderableItem class drawn on chart.
 */
export abstract class ChartRenderableItem extends ChartContent(RenderableItem) {

  override placeOnChart(chart?: ChartApi<any>) {
    super.placeOnChart(chart);
    this.chart?.addContentItem(this);
  }

  override removeFromChart() {
    this.chart?.removeContentItem(this);
    super.removeFromChart();
  }
}
