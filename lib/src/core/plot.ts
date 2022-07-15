import {ChartRenderableItem} from "./chart-renderable-item";
import {LayerName} from "./layer-name";
import Konva from "konva";
import {MathHelper} from "../services";

export abstract class Plot extends ChartRenderableItem {

  private readonly id: number;
  private layerName: string;
  private plotShape: Konva.Shape;

  private static currentPlotID: number = 1;

  constructor() {
    super();

    this.id = Plot.currentPlotID++;
    this.layerName = `plot-layer-${this.id}`;
    this.plotShape = new Konva.Shape({
      fill: this.options.backgroundColor,
      stroke: this.options.foregroundColor,
      strokeWidth: 1,
      sceneFunc: function (context, shape) {
        let location = self.location;
        let size = self._size;

        let roundedX = MathHelper.optimizeValue(location.x);
        let roundedY = MathHelper.optimizeValue(location.y);

        let roundedWidth = MathHelper.optimizeValue(size!.width);
        let roundedHeight = MathHelper.optimizeValue(size!.height);
        if (self.options.drawBorder) {
          context.strokeRect(roundedX, roundedY, roundedWidth, roundedHeight);
        }
        context.fillRect(roundedX, roundedY, roundedWidth, roundedHeight);
      }
    });

  }

  getDependantLayers(): string[] {
    return [this.layerName];
  }
}
