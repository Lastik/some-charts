import {Font} from "../../../font";
import {PlotOptionsClass} from "../plot-options-class";
import {BarsPlotOptions, BarsPlotOptionsDefaults} from "./bars-plot-options";
import {MetricOptions} from "../metric-options";
import {Palette} from "../../../chart/plots";
import {Color} from "../../../color";

/**
 * Bars plot options class
 * */
export class BarsPlotOptionsClass extends PlotOptionsClass implements BarsPlotOptions {
  metrics: Array<MetricOptions<Color>>;

  font: Font;
  foregroundColor: Color;
  drawLabelsOnBars: boolean;
  labelsPrecision: number;
  useDarkerBorder: boolean;

  constructor(barsPlotOptions: BarsPlotOptions) {
    super(barsPlotOptions);

    const defaultSkin = BarsPlotOptionsDefaults.Instance.defaultSkin;

    this.metrics = barsPlotOptions.metrics;
    this.drawLabelsOnBars = barsPlotOptions.drawLabelsOnBars ?? defaultSkin.drawLabelsOnBars!;
    this.font = barsPlotOptions.font!;
    this.foregroundColor = barsPlotOptions.foregroundColor! ;
    this.labelsPrecision = barsPlotOptions.labelsPrecision ?? defaultSkin.labelsPrecision!;
    this.useDarkerBorder = barsPlotOptions.useDarkerBorder ?? defaultSkin.useDarkerBorder!;
  }

  get metricsOptions(): Array<MetricOptions<Color | Palette>> {
    return this.metrics;
  }
}
