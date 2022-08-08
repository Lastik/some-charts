import {FontInUnits} from "../../../font";
import {MetricDependantValue} from "../../../plots";
import {MarkerPlotOptions} from "./marker-plot-options";
import {PlotOptionsClass} from "../plot-options-class";
import {MetricOptions} from "../metric-options";

/**
 * Marker plot options class
 */
export class MarkerPlotOptionsClass extends PlotOptionsClass implements MarkerPlotOptions{
  metric: MetricOptions;
  font: FontInUnits;
  foregroundColor: string;
  markerSize: number | MetricDependantValue<number>;

  constructor(markerPlotOptions: MarkerPlotOptions) {
    super(markerPlotOptions);
    this.metric = markerPlotOptions.metric;
    this.font = markerPlotOptions.font;
    this.foregroundColor = markerPlotOptions.foregroundColor;
    this.markerSize = markerPlotOptions.markerSize;
  }

  get metricsOptions(): Array<MetricOptions> {
    return [this.metric];
  }
}
