import {PlotKind} from "./plot-kind";
import {PlotOptions} from "./plot-options";

export class PlotOptionsClass {
  metricName: string;
  caption: string;
  kind: PlotKind

  constructor(plotOptions: PlotOptions) {
    this.metricName = plotOptions.metricName;
    this.caption = plotOptions.caption;
    this.kind = plotOptions.kind
  }
}
