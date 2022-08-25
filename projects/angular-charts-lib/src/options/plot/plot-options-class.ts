import {PlotKind} from "./plot-kind";
import {PlotOptions} from "./plot-options";
import {MetricOptions} from "./metric-options";
import {Palette} from "../../chart/plots";
import * as Color from "color";

export abstract class PlotOptionsClass implements PlotOptions {
  kind: PlotKind;

  protected constructor(plotOptions: PlotOptions) {
    this.kind = plotOptions.kind
  }

  abstract get metricsOptions(): Array<MetricOptions<Color|Palette>>
}
