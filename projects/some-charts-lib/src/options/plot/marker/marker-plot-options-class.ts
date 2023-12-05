import {MetricDependantValue, Palette} from "../../../chart/plots";
import {MarkerPlotOptions} from "./marker-plot-options";
import {PlotOptionsClass} from "../plot-options-class";
import {MetricOptions} from "../metric-options";
import {Color} from "../../../color";

/**
 * Marker plot options class
 */
export class MarkerPlotOptionsClass extends PlotOptionsClass implements MarkerPlotOptions {
  metric: MetricOptions<Color | Palette>;
  markerSize: number | MetricDependantValue<number>;

  constructor(markerPlotOptions: MarkerPlotOptions) {
    super(markerPlotOptions);
    this.metric = markerPlotOptions.metric;
    this.markerSize = markerPlotOptions.markerSize;
  }

  get metricsOptions(): Array<MetricOptions<Color | Palette>> {
    return [this.metric];
  }
}
