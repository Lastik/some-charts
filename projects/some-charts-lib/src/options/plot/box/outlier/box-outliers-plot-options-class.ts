import {BoxOutliersPlotOptions} from "./box-outliers-plot-options";
import {MetricOptions} from "../../metric-options";
import * as Color from "color";
import {PlotOptionsClass} from "../../plot-options-class";
import {Palette} from "../../../../chart";

/**
 * Box outliers plot options class
 */
export class BoxOutliersPlotOptionsClass extends PlotOptionsClass implements BoxOutliersPlotOptions {

  metric: MetricOptions<Color>;
  markerSize: number;

  constructor(boxOutliersPlotOptionsx: BoxOutliersPlotOptions) {
    super(boxOutliersPlotOptionsx);
    this.metric = boxOutliersPlotOptionsx.metric;
    this.markerSize = boxOutliersPlotOptionsx.markerSize;
  }

  get metricsOptions(): Array<MetricOptions<Color | Palette>> {
    return [this.metric];
  }
}
