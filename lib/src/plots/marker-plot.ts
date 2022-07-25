import {Plot} from "../core";
import Konva from "konva";
import {MarkerPlotOptions} from "../options/plot/marker-plot-options";
import {DataSet} from "../core/data";

export class MarkerPlot<TItemType,
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined>
    extends Plot<MarkerPlotOptions, TItemType, XDimensionType, YDimensionType>{

  constructor(dataSet: DataSet<TItemType, XDimensionType, YDimensionType>, options: MarkerPlotOptions) {
    super(dataSet, options);
  }

  protected drawFunc(context: Konva.Context, shape: Konva.Shape): void {
  }

}
