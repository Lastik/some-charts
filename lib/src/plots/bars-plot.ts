import {Plot} from "../core";
import Konva from "konva";
import {DataSet} from "../core/data";
import {BarsPlotOptions, BarsPlotOptionsDefaults, ChartOptionsDefaults} from "../options";
import extend from "lodash-es/extend";

export class BarsPlot<TItemType,
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined>
  extends Plot<BarsPlotOptions, TItemType, XDimensionType, YDimensionType>{

  constructor(dataSet: DataSet<TItemType, XDimensionType, YDimensionType>, options: BarsPlotOptions) {
    super(dataSet, options);

    this.plotOptions = extend(BarsPlotOptionsDefaults.Instance, options);
  }

  protected drawFunc(context: Konva.Context, shape: Konva.Shape): void {
  }

}
