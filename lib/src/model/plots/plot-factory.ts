import {singleton} from "tsyringe";
import {Plot} from "./plot";
import {DataSet} from "../data";
import {DataTransformation} from "../index";
import {BarsPlot} from "./bars/bars-plot";
import {MarkerPlot} from "./marker-plot";
import {BarsPlotOptions, MarkerPlotOptions, PlotKind, PlotOptions} from "../index";

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
