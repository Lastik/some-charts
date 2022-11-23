import {Palette} from "../../../chart";
import {PlotOptionsClass} from "../plot-options-class";
import {MetricOptions} from "../metric-options";
import * as Color from "color";
import {BoxPlotOptions, BoxPlotOptionsDefaults} from "./box-plot-options";

/**
 * Marker plot options class
 */
export class BoxPlotOptionsClass extends PlotOptionsClass implements BoxPlotOptions {

  public metric: MetricOptions<Color | Palette>;
  public lineWidth: number;
  public stroke: Color;

  constructor(boxPlotOptions: BoxPlotOptions) {
    super(boxPlotOptions);
    this.metric = boxPlotOptions.metric;
    this.lineWidth = boxPlotOptions.lineWidth ?? BoxPlotOptionsDefaults.Instance.lineWidth!;
    this.stroke = boxPlotOptions.stroke ?? BoxPlotOptionsDefaults.Instance.stroke!;
  }

  get metricsOptions(): Array<MetricOptions<Color | Palette>> {
    return [this.metric];
  }
}
