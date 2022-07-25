import {ChartRenderableItem} from "./chart-renderable-item";
import Konva from "konva";
import {DataSet} from "./data";
import {DataRect} from "../model";
import {PlotOptions} from "../options";

export abstract class Plot<
  PlotOptionsType extends PlotOptions,
  TItemType,
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined> extends ChartRenderableItem {

  private readonly layerName: string;
  private plotShape: Konva.Shape;

  protected visible: DataRect | undefined;
  protected screen: DataRect | undefined;

  protected dataSet: DataSet<TItemType, XDimensionType, YDimensionType>;
  protected plotOptions: PlotOptionsType;

  protected constructor(dataSet: DataSet<TItemType, XDimensionType, YDimensionType>, plotOptions: PlotOptionsType) {
    super();

    this.dataSet = dataSet;
    this.plotOptions = plotOptions;

    this.layerName = `plot-layer-${this.id}`;
    this.plotShape = new Konva.Shape({
      sceneFunc: this.drawFunc
    });
  }

  protected abstract drawFunc(context: Konva.Context, shape: Konva.Shape): void;

  getDependantLayers(): string[] {
    return [this.layerName];
  }

  /**
  * Sets visible rectangle of plot
   * @param {DataRect} visible - Visible rectangle of plot.
  */
  setVisible(visible: DataRect) {
    this.visible = visible;
    this.markDirty();
  }

  /**
   * Sets screen rectangle of plot
   * @param {DataRect} screen - Screen rectangle of plot.
   */
  setScreen(screen: DataRect) {
    this.screen = screen;
    this.markDirty();
  }
}
