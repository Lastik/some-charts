import {MetricDependantValue, Palette} from "../../../chart/plots";
import {PlotOptionsClass} from "../plot-options-class";
import {MetricOptions} from "../metric-options";
import * as Color from "color";
import { BoxPlotOptions } from "./box-plot-options";

/**
 * Marker plot options class
 */
export class BoxPlotOptionsClass extends PlotOptionsClass implements BoxPlotOptions {

  public metric: MetricOptions<Color | Palette>;
  public boxWidth: number;
  public lineWidth: number;
  public stroke: Color;
  public whiskersWidth: number;

  constructor(boxPlotOptions: BoxPlotOptions) {
    super(boxPlotOptions);
    this.metric = boxPlotOptions.metric;
    this.boxWidth = boxPlotOptions.boxWidth;
    this.lineWidth = boxPlotOptions.lineWidth;
    this.stroke = boxPlotOptions.stroke;
    this.whiskersWidth = boxPlotOptions.whiskersWidth;
  }

  get metricsOptions(): Array<MetricOptions<Color | Palette>> {
    return [this.metric];
  }
}
