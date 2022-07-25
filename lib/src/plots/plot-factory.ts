import {singleton} from "tsyringe";
import {BarsPlotOptions, MarkerPlotOptions, PlotKind, PlotOptions} from "../options";
import {Plot} from "../core";
import {BarsPlot} from "./bars-plot";
import {DataSet} from "../core/data";
import {MarkerPlot} from "./marker-plot";

@singleton()
export class PlotFactory {
  public createPlot<TItemType,
    XDimensionType extends number | string | Date,
    YDimensionType extends number | string | Date | undefined = undefined>(
    dataSet: DataSet<TItemType, XDimensionType, YDimensionType>,
    plotOptions: PlotOptions): Plot<PlotOptions, TItemType, XDimensionType, YDimensionType> | undefined {
    if (plotOptions.kind === PlotKind.Bars) {
      return new BarsPlot(dataSet, <BarsPlotOptions>plotOptions)
    } else if (plotOptions.kind === PlotKind.Marker) {
      return new MarkerPlot(dataSet, <MarkerPlotOptions>plotOptions);
    } else return undefined;
  }
}
