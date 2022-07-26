import {singleton} from "tsyringe";
import {BarsPlotOptions, MarkerPlotOptions, PlotKind, PlotOptions} from "../options";
import {DataSet} from "./data";
import {Plot} from "./plot";
import {BarsPlot, MarkerPlot} from "./plots";
import {DataTransformation} from "../model";

@singleton()
export class PlotFactory {
  public createPlot<TItemType,
    XDimensionType extends number | string | Date,
    YDimensionType extends number | string | Date | undefined = undefined>(
    dataSet: DataSet<TItemType, XDimensionType, YDimensionType>,
    dataTransformation: DataTransformation,
    plotOptions: PlotOptions): Plot<PlotOptions, TItemType, XDimensionType, YDimensionType> | undefined {
    if (plotOptions.kind === PlotKind.Bars) {
      return new BarsPlot(dataSet, dataTransformation, <BarsPlotOptions>plotOptions)
    } else if (plotOptions.kind === PlotKind.Marker) {
      return new MarkerPlot(dataSet, dataTransformation, <MarkerPlotOptions>plotOptions);
    } else return undefined;
  }
}
