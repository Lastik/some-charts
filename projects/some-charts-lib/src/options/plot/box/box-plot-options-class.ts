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
  public boxWidth: number;
  public lineWidth: number;
  public stroke: Color;
  public whiskersWidth: number;

  constructor(boxPlotOptions: BoxPlotOptions) {
    super(boxPlotOptions);
    this.metric = boxPlotOptions.metric;
    this.boxWidth = boxPlotOptions.boxWidth ?? BoxPlotOptionsDefaults.Instance.boxWidth!;
    this.lineWidth = boxPlotOptions.lineWidth ?? BoxPlotOptionsDefaults.Instance.lineWidth!;
    this.stroke = boxPlotOptions.stroke ?? BoxPlotOptionsDefaults.Instance.stroke!;
    this.whiskersWidth = boxPlotOptions.whiskersWidth ?? BoxPlotOptionsDefaults.Instance.whiskersWidth!;
  }

  get metricsOptions(): Array<MetricOptions<Color | Palette>> {
    return [this.metric];
  }
}
