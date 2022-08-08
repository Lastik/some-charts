import Konva from "konva";
import extend from "lodash-es/extend";
import {DataTransformation} from "../index";
import {BarsPlotOptions, BarsPlotOptionsDefaults} from "../index";
import {DataSet, DimensionValue} from "../data";
import {Plot} from "./plot";

export class BarsPlot<TItemType,
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined>
  extends Plot<BarsPlotOptions, TItemType, XDimensionType, YDimensionType>{

  constructor(dataSet: DataSet<TItemType, XDimensionType, YDimensionType>,
              dataTransformation: DataTransformation,
              options: BarsPlotOptions) {
    super(dataSet, dataTransformation, options);

    this.plotOptions = extend(BarsPlotOptionsDefaults.Instance, options);
  }

  protected draw1DData(context: Konva.Context, shape: Konva.Shape, xDimension: DimensionValue<XDimensionType>[], metricValues: number[]): void {
  }

  protected draw2DData(context: Konva.Context, shape: Konva.Shape, xDimension: DimensionValue<XDimensionType>[], yDimension: DimensionValue<Exclude<YDimensionType, undefined>>[]): void {
    throw new Error(Plot.errors.doesntSupport2DData);
  }
}
