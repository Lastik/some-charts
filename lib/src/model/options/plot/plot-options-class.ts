import {PlotKind} from "./plot-kind";
import {PlotOptions} from "./plot-options";
import {MarkerPlotOptions, MarkerPlotOptionsClass} from "./marker";
import {BarsPlotOptions, BarsPlotOptionsClass} from "./bars";
import {MetricOptions} from "./metric-options";

export abstract class PlotOptionsClass implements PlotOptions {
  kind: PlotKind;

  protected constructor(plotOptions: PlotOptions) {
    this.kind = plotOptions.kind
  }

  abstract get metricsOptions(): Array<MetricOptions>

  static apply(plotOptions: PlotOptions): PlotOptionsClass | undefined {
    if(plotOptions.kind === PlotKind.Marker){
      return new MarkerPlotOptionsClass(plotOptions as MarkerPlotOptions);
    }
    else if(plotOptions.kind === PlotKind.Bars){
      return new BarsPlotOptionsClass(plotOptions as BarsPlotOptions);
    }
    else return undefined
  }
}
