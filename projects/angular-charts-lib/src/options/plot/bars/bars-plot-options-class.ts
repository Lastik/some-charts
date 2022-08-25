import {FontInUnits} from "../../../font";
import {PlotOptionsClass} from "../plot-options-class";
import {BarsPlotOptions} from "./bars-plot-options";
import {MetricOptions} from "../metric-options";
import * as Color from "color";
import {Palette} from "../../../chart/plots";

/**
 * Bars plot options class
 */
export class BarsPlotOptionsClass extends PlotOptionsClass implements BarsPlotOptions {
  metrics: Array<MetricOptions<Color>>;

  font: FontInUnits;
  drawLabelsOnBars: boolean;
  foregroundColor: Color;
  labelsPrecision: number;
  useDarkerBorder: boolean;

  constructor(barsPlotOptions: BarsPlotOptions) {
    super(barsPlotOptions);
    this.metrics = barsPlotOptions.metrics;
    this.drawLabelsOnBars = barsPlotOptions.drawLabelsOnBars;
    this.font = barsPlotOptions.font;
    this.foregroundColor = barsPlotOptions.foregroundColor;
    this.labelsPrecision = barsPlotOptions.labelsPrecision;
    this.useDarkerBorder = barsPlotOptions.useDarkerBorder;
  }

  get metricsOptions(): Array<MetricOptions<Color | Palette>> {
    return this.metrics;
  }
}
