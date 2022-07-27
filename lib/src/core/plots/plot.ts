import Konva from "konva";
import {PlotOptions} from "../../options";
import {ChartRenderableItem} from "../chart";
import {DataRect, DataTransformation} from "../../model";
import {DataSet, DimensionValue} from "../data";

export abstract class Plot<
  PlotOptionsType extends PlotOptions,
  TItemType,
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined> extends ChartRenderableItem {

  private readonly layerName: string;
  private plotShape: Konva.Shape;

  protected visible: DataRect | undefined;
  protected screen: DataRect | undefined;

  protected readonly dataSet: DataSet<TItemType, XDimensionType, YDimensionType>;
  protected readonly  dataTransformation: DataTransformation;
  protected plotOptions: PlotOptionsType;

  protected constructor(
    dataSet: DataSet<TItemType, XDimensionType, YDimensionType>,
    dataTransformation: DataTransformation,
    plotOptions: PlotOptionsType) {
    super();

    this.dataSet = dataSet;
    this.dataTransformation = dataTransformation;
    this.plotOptions = plotOptions;

    this.layerName = `plot-layer-${this.id}`;
    this.plotShape = new Konva.Shape({
      sceneFunc: this.drawFunc
    });
  }

  private drawFunc(context: Konva.Context, shape: Konva.Shape): void {
    let screen = this.screen;
    if (screen) {
      let screenLocaton = screen.getMinXMinY();
      let screenSize = screen.getSize();

      context.save();
      context.beginPath();
      context.rect(screenLocaton.x + 0.5, screenLocaton.y + 0.5, screenSize.width - 0.5, screenSize.height - 0.5);
      context.clip();

      let xDimension = this.dataSet.dimensionXValues;
      let yDimension = this.dataSet.dimensionYValues;

      let is2D = this.dataSet.is2D;

      let metricValues = this.dataSet.getMetricValues(this.plotOptions.metric);

      if (is2D) {
        this.draw2DData(context, shape, xDimension, yDimension!, <number[][]>metricValues);
      } else {
        this.draw1DData(context, shape, xDimension, <number[]>metricValues);
      }

      context.restore();
    }
  }

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

  protected abstract draw1DData(context: Konva.Context, shape: Konva.Shape,
                                xDimension: readonly DimensionValue<XDimensionType>[],
                                metricValues: number[]): void;

  protected abstract draw2DData(context: Konva.Context, shape: Konva.Shape,
                                xDimension: readonly DimensionValue<XDimensionType>[],
                                yDimension: readonly DimensionValue<Exclude<YDimensionType, undefined>>[], metricValues: number[][]): void;
}

