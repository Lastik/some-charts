import {PlotOptions} from "./plot-options";
import {PlotKind} from "./plot-kind";
import {BoxOutliersPlotOptions, BoxOutliersPlotOptionsClass, MarkerPlotOptions, MarkerPlotOptionsClass} from "./marker";
import {BarsPlotOptions, BarsPlotOptionsClass} from "./bars";
import {PlotOptionsClass} from "./plot-options-class";
import {BoxPlotOptions, BoxPlotOptionsClass} from "./box";

export class PlotOptionsClassFactory {
  static buildPlotOptionsClass(plotOptions: PlotOptions): PlotOptionsClass {
    if (plotOptions.kind === PlotKind.Marker) {
      return new MarkerPlotOptionsClass(plotOptions as MarkerPlotOptions);
    } else if (plotOptions.kind === PlotKind.Bars) {
      return new BarsPlotOptionsClass(plotOptions as BarsPlotOptions);
    } else if (plotOptions.kind === PlotKind.Box) {
      return new BoxPlotOptionsClass(plotOptions as BoxPlotOptions);
    } else if (plotOptions.kind === PlotKind.BoxOutliers) {
      return new BoxOutliersPlotOptionsClass(plotOptions as BoxOutliersPlotOptions);
    } else throw new Error('Can\'t cast specified PlotOptions to PlotOptionsClass. The kind property has invalid value.')
  }
}
