import merge from "lodash-es/merge";
import {
  BoxPlotOptions, BoxPlotOptionsClass, BoxPlotOptionsDefaults,
  PlotOptionsClassFactory
} from "../../../../options";
import {DataSet, DimensionValue} from "../../../../data";
import {DataTransformation, Margin, NumericPoint} from "../../../../geometry";
import {PlotDrawableElement} from "../plot-drawable-element";
import {Box} from "./box";
import {cloneDeep} from "lodash-es";
import {ElementwisePlot} from "../elementwise-plot";
import {PlotErrorBuilder} from "../../plot-error-builder";

export class BoxPlot<TItemType,
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined>
  extends ElementwisePlot<BoxPlotOptions, BoxPlotOptionsClass, TItemType, XDimensionType, YDimensionType> {

  constructor(
    dataSet: DataSet<TItemType, XDimensionType, YDimensionType>,
    dataTransformation: DataTransformation,
    options: BoxPlotOptions,
    protected plotErrorBuilder: PlotErrorBuilder = PlotErrorBuilder.Instance) {
    super(dataSet, dataTransformation, options);

    this.plotOptions = PlotOptionsClassFactory.buildPlotOptionsClass(merge(cloneDeep(BoxPlotOptionsDefaults.Instance), options)) as BoxPlotOptionsClass;
  }

  protected add1DPlotElement(xDimVal: DimensionValue<XDimensionType>): [PlotDrawableElement] {

    let metricId = this.plotOptions.metric.id;

    let boxColor = this.getColor(this.plotOptions.metric.color, xDimVal);
    let metricValue = this.dataSet.getVectorMetricValue(metricId, xDimVal.value)!;

    let points = metricValue.map(y => new NumericPoint(xDimVal.toNumericValue(), y));
    return [new Box(
      metricId,
      points,
      boxColor,
      this.plotOptions.stroke,
      this.plotOptions.boxWidth,
      this.plotOptions.whiskersWidth,
      this.plotOptions.lineWidth)];
  }

  protected add2DPlotElement(xDimVal: DimensionValue<XDimensionType>, yDimVal: DimensionValue<Exclude<YDimensionType, undefined>>): [PlotDrawableElement] {
    throw this.plotErrorBuilder.buildPlotDoesntSupport2DRendering(this.plotOptions.kind);
  }

  protected update1DPlotElement(plotElt: PlotDrawableElement, xDimVal: DimensionValue<XDimensionType>) {
    let metricId = this.plotOptions.metric.id;

    let boxColor = this.getColor(this.plotOptions.metric.color, xDimVal);
    let metricValue = this.dataSet.getVectorMetricValue(metricId, xDimVal.value);
    let points = metricValue?.map(y => new NumericPoint(xDimVal.toNumericValue(), y));

    let box = plotElt as Box;

    if (boxColor && points) {
      box.setDataPoints(points);
      box.fill = boxColor;
    }
  }

  protected update2DPlotElement(plotElt: PlotDrawableElement, xDimVal: DimensionValue<XDimensionType>, yDimVal: DimensionValue<Exclude<YDimensionType, undefined>>) {
    throw this.plotErrorBuilder.buildPlotDoesntSupport2DRendering(this.plotOptions.kind);
  }

  override getFitToViewMargin(): Margin {
    let eltWidth = Math.max(this.plotOptions.boxWidth + this.plotOptions.whiskersWidth);
    return new Margin(0, eltWidth / 2, 0, eltWidth / 2)
  }
}
