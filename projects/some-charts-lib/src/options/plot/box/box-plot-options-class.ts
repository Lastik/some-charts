import {Palette} from "../../../chart";
import {PlotOptionsClass} from "../plot-options-class";
import {MetricOptions} from "../metric-options";
import * as Color from "color";
import {BoxPlotOptions, BoxPlotOptionsDefaults} from "./box-plot-options";
import {Skin} from "../../skin";

/**
 * Marker plot options class
 */
export class BoxPlotOptionsClass extends PlotOptionsClass implements BoxPlotOptions {

  public metric: MetricOptions<Color | Palette>;
  public lineWidth: number;
  public stroke: Color;

  constructor(boxPlotOptions: BoxPlotOptions) {
    super(boxPlotOptions);

    let defaultSkin = BoxPlotOptionsDefaults.Instance.skins[Skin.Default];

    this.metric = boxPlotOptions.metric;
    this.lineWidth = boxPlotOptions.lineWidth ?? defaultSkin.lineWidth!;
    this.stroke = boxPlotOptions.stroke ?? defaultSkin.stroke!;
  }

  get metricsOptions(): Array<MetricOptions<Color | Palette>> {
    return [this.metric];
  }
}
