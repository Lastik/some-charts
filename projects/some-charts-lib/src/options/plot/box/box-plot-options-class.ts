import {MetricDependantValue, Palette} from "../../../chart/plots";
import {BoxPlotOptions} from "./marker-plot-options";
import {PlotOptionsClass} from "../plot-options-class";
import {MetricOptions} from "../metric-options";
import * as Color from "color";

/**
 * Marker plot options class
 */
export class BoxPlotOptionsClass extends PlotOptionsClass implements BoxPlotOptions {
  metric: MetricOptions<Color | Palette>;
  markerSize: number | MetricDependantValue<number>;

  constructor(markerPlotOptions: BoxPlotOptions) {
    super(markerPlotOptions);
    this.metric = markerPlotOptions.metric;
    this.markerSize = markerPlotOptions.markerSize;
  }

  get metricsOptions(): Array<MetricOptions<Color | Palette>> {
    return [this.metric];
  }
}
