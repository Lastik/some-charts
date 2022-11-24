import merge from "lodash-es/merge";
import {
  BoxPlotOptions, BoxPlotOptionsClass, BoxPlotOptionsDefaults,
  PlotOptionsClassFactory
} from "../../../../options";
import {DataSet, DimensionValue} from "../../../../data";
import {DataTransformation, NumericPoint} from "../../../../geometry";
import {PlotDrawableElement} from "../plot-drawable-element";
import {Box} from "./box";
import {cloneDeep, uniq} from "lodash-es";
import {ElementwisePlot} from "../elementwise-plot";
import {PlotErrorBuilder} from "../../plot-error-builder";

export class BoxPlot<TItemType,
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined>
  extends ElementwisePlot<BoxPlotOptions, BoxPlotOptionsClass, TItemType, XDimensionType, YDimensionType> {
  private boxDataWidth: number = 0;
  private whiskersDataWidth: number = 0;

  constructor(
    dataSet: DataSet<TItemType, XDimensionType, YDimensionType>,
    dataTransformation: DataTransformation,
    options: BoxPlotOptions,
    protected plotErrorBuilder: PlotErrorBuilder = PlotErrorBuilder.Instance) {
    super(dataSet, dataTransformation, options);

    this.plotOptions = PlotOptionsClassFactory.buildPlotOptionsClass(merge(cloneDeep(BoxPlotOptionsDefaults.Instance), options)) as BoxPlotOptionsClass;
  }

  override initOnDataSetUpdate(){
    let avgXDelta = this.getAvgXDelta(this.plotOptions.metric.id) ?? 0;
    this.boxDataWidth = avgXDelta / 2;
    this.whiskersDataWidth = avgXDelta / 3;
  }

  protected add1DPlotElement(xDimVal: DimensionValue<XDimensionType>): [PlotDrawableElement] {

    let metricId = this.plotOptions.metric.id;

    let boxColor = this.getColor(this.plotOptions.metric.color, xDimVal);
    let metricValue = this.dataSet.getArrayMetricValue(metricId, xDimVal.value)!;

    let points = metricValue.map(y => new NumericPoint(xDimVal.toNumericValue(), y));
    return [new Box(
      metricId,
      points,
      boxColor,
      this.plotOptions.stroke,
      this.boxDataWidth,
      this.whiskersDataWidth,
      this.plotOptions.lineWidth)];
  }

  protected add2DPlotElement(xDimVal: DimensionValue<XDimensionType>, yDimVal: DimensionValue<Exclude<YDimensionType, undefined>>): [PlotDrawableElement] {
    throw this.plotErrorBuilder.buildPlotDoesntSupport2DRendering(this.plotOptions.kind);
  }

  protected update1DPlotElement(plotElt: PlotDrawableElement, xDimVal: DimensionValue<XDimensionType>) {
    let metricId = this.plotOptions.metric.id;

    let boxColor = this.getColor(this.plotOptions.metric.color, xDimVal);
    let metricValue = this.dataSet.getArrayMetricValue(metricId, xDimVal.value);
    let points = metricValue?.map(y => new NumericPoint(xDimVal.toNumericValue(), y));

    let box = plotElt as Box;

    if (boxColor && points) {
      box.setDataPoints(points, this.plotOptions.animate, this.plotOptions.animationDuration);
      box.fill = boxColor;
      box.boxDataWidth = this.boxDataWidth;
      box.whiskersDataWidth = this.whiskersDataWidth;
    }
  }

  protected update2DPlotElement(plotElt: PlotDrawableElement, xDimVal: DimensionValue<XDimensionType>, yDimVal: DimensionValue<Exclude<YDimensionType, undefined>>) {
    throw this.plotErrorBuilder.buildPlotDoesntSupport2DRendering(this.plotOptions.kind);
  }

  protected getAvgXDelta(metricId: string): number | undefined {
    let allXValues = uniq(this.getArrayMetricPoints1D(metricId)?.flatMap(p => p.map(pI => pI.x)).sort((l, r) => l - r));

    if(allXValues) {
      let sumXDelta = 0;
      for (let i = 0; i < allXValues.length - 1; i++) {
        sumXDelta += allXValues[i + 1] - allXValues[i];
      }

      return sumXDelta / (allXValues.length - 1);
    }
    else return undefined;
  }
}
