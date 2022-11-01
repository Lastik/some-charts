import {PlotKind} from "./plot-kind";
import {PlotOptions} from "./plot-options";
import {MetricOptions} from "./metric-options";
import {Palette} from "../../chart/plots";
import * as Color from "color";

export abstract class PlotOptionsClass implements PlotOptions {
  kind: PlotKind;
  animate?: boolean;
  animationDuration?: number;

  protected constructor(plotOptions: PlotOptions) {
    this.kind = plotOptions.kind;
    this.animate = plotOptions.animate;
    this.animationDuration = plotOptions.animationDuration;
  }

  abstract get metricsOptions(): Array<MetricOptions<Color|Palette>>
}
