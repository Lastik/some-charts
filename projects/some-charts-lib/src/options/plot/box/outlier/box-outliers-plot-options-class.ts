import {BoxOutliersPlotOptions, BoxOutliersPlotOptionsDefaults} from "./box-outliers-plot-options";
import {MetricOptions} from "../../metric-options";
import {PlotOptionsClass} from "../../plot-options-class";
import {Palette} from "../../../../chart";
import {Color} from "../../../../color";

/**
 * Box outliers plot options class
 */
export class BoxOutliersPlotOptionsClass extends PlotOptionsClass implements BoxOutliersPlotOptions {

  metric: MetricOptions<Color>;
  markerSize: number;

  constructor(boxOutliersPlotOptionsx: BoxOutliersPlotOptions) {
    super(boxOutliersPlotOptionsx);

    const defaultSkin = BoxOutliersPlotOptionsDefaults.Instance.defaultSkin;

    this.metric = boxOutliersPlotOptionsx.metric;
    this.markerSize = boxOutliersPlotOptionsx.markerSize ?? defaultSkin.markerSize!;
  }

  get metricsOptions(): Array<MetricOptions<Color | Palette>> {
    return [this.metric];
  }
}
