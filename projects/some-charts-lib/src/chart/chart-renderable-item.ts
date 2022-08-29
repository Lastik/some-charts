import {ChartContent} from "./chart-content"
import {Chart} from "./chart";
import {RenderableItem} from "../renderer";
import {ChartContentPlaceholder} from "./chart-content-placeholder";

/**
 * Implementation of RenderableItem class drawn on chart.
 */
export abstract class ChartRenderableItem extends ChartContent(RenderableItem) {

  override placeOnChart(chart?: ChartContentPlaceholder) {
    super.placeOnChart(chart);
    chart?.addContentItem(this);
  }

  override removeFromChart() {
    this.chart?.removeContentItem(this);
    super.removeFromChart();
  }
}
