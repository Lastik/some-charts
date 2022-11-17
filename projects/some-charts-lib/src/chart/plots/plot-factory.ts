import {Plot} from "./plot";
import {DataSet} from "../../data";
import {BarsPlot, MarkerPlot, BoxPlot} from "./elementwise";

import {
  BarsPlotOptions,
  MarkerPlotOptions,
  PlotOptions,
  PlotOptionsClass,
  PlotKind, BoxPlotOptions
} from "../../options";

import {
  DataTransformation,
} from "../../geometry";

export class PlotFactory {

  private PlotFactory(){ }

  public createPlot<TItemType,
    XDimensionType extends number | string | Date,
    YDimensionType extends number | string | Date | undefined = undefined>(
    dataSet: DataSet<TItemType, XDimensionType, YDimensionType>,
    dataTransformation: DataTransformation,
    plotOptions: PlotOptions): Plot<PlotOptions, PlotOptionsClass, TItemType, XDimensionType, YDimensionType> | undefined {
    if (plotOptions.kind === PlotKind.Bars) {
      return new BarsPlot(dataSet, dataTransformation, <BarsPlotOptions>plotOptions)
    } else if (plotOptions.kind === PlotKind.Marker) {
      return new MarkerPlot(dataSet, dataTransformation, <MarkerPlotOptions>plotOptions);
    } else if (plotOptions.kind === PlotKind.Box) {
      return new BoxPlot(dataSet, dataTransformation, <BoxPlotOptions>plotOptions);
    } else return undefined;
  }


  public static readonly Instance = new PlotFactory();
}
