import {ChartContent} from "./chart-content"
import {RenderableItem} from "../renderer";
import {Chart} from "./chart";
import Konva from "konva";

/**
 * Implementation of RenderableItem class drawn on chart.
 */
export abstract class ChartRenderableItem<ShapeType extends Konva.Group | Konva.Shape = Konva.Group | Konva.Shape> extends ChartContent(RenderableItem) {

  protected abstract layerId: string;
  protected abstract konvaDrawables: ShapeType[];

  override placeOnChart(chart?: Chart) {
    super.placeOnChart(chart);
    this.chart?.addContentItem(this);

    if (chart) {
      let layer = chart!.getLayer(this.layerId);
      for(let konvaDrawable of this.konvaDrawables) {
        layer?.add(konvaDrawable);
      }
    }
  }

  override removeFromChart() {
    for(let konvaDrawable of this.konvaDrawables) {
      konvaDrawable.remove();
    }
    this.chart?.removeContentItem(this);
    super.removeFromChart();
  }

  getDependantLayers(): string[] {
    return [this.layerId];
  }
}
