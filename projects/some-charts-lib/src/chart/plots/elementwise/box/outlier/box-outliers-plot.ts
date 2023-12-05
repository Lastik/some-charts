import merge from "lodash-es/merge";
import {
  BoxOutliersPlotOptions, BoxOutliersPlotOptionsClass, BoxOutliersPlotOptionsDefaults,
  PlotOptionsClassFactory
} from "../../../../../options";
import {DataSet, DimensionValue} from "../../../../../data";
import {DataTransformation, NumericPoint, NumericRange} from "../../../../../geometry";
import {PlotDrawableElement} from "../../plot-drawable-element";
import {cloneDeep} from "lodash-es";
import {Plot} from "../../../plot";
import {PercentileHelper} from "../../../../../services";
import {ElementwisePlot} from "../../elementwise-plot";
import {BoxOutliers} from "./box-outliers";
import {Color} from "../../../../../color";

export class BoxOutliersPlot<TItemType,
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined>
  extends ElementwisePlot<BoxOutliersPlotOptions, BoxOutliersPlotOptionsClass,
    TItemType, XDimensionType, YDimensionType> {

  private statRangeByMetricId!: Map<string, Map<number, NumericRange>>;

  constructor(
    dataSet: DataSet<TItemType, XDimensionType, YDimensionType>,
    dataTransformation: DataTransformation,
    options: BoxOutliersPlotOptions) {
    super(dataSet, dataTransformation, options);
  }

  override buildPlotOptionsClass(options: BoxOutliersPlotOptions): BoxOutliersPlotOptionsClass {
    return  PlotOptionsClassFactory.buildPlotOptionsClass(merge(cloneDeep(BoxOutliersPlotOptionsDefaults.Instance), options)) as BoxOutliersPlotOptionsClass;
  }

  override init(plotOptions: BoxOutliersPlotOptionsClass){
    super.init(plotOptions);
    this.statRangeByMetricId = new Map<string, Map<number, NumericRange>>();
  }

  override reinitOnDataSetUpdate() {
    this.statRangeByMetricId.clear();
  }

  override add1DPlotElements(xDimVal: DimensionValue<XDimensionType>): [PlotDrawableElement] | [] {

    let metricId = this.plotOptions.metric.id;

    let markerColor = this.getColor(this.plotOptions.metric.color, xDimVal);
    let markerSize = this.plotOptions.markerSize;

    let statRange = this.getYStatisticalRange(metricId, xDimVal);

    let metricPoints =
      this.dataSet.getArrayMetricValue(metricId, xDimVal.value)!
        .filter(mv => mv < statRange.min || mv > statRange.max)
        .map(y => new NumericPoint(xDimVal.toNumericValue(), y));

    return metricPoints.length !== 0 ? [new BoxOutliers(
      metricId,
      metricPoints,
      markerColor, markerSize)] : [];
  }

  override add2DPlotElements(xDimVal: DimensionValue<XDimensionType>, yDimVal: DimensionValue<Exclude<YDimensionType, undefined>>): PlotDrawableElement[] {
    throw new Error(Plot.errors.doesntSupport2DData);
  }

  override update1DPlotElement(plotElt: PlotDrawableElement, xDimVal: DimensionValue<XDimensionType>) {
    let markerColor = this.getColor(this.plotOptions.metric.color, xDimVal);
    let markerSize = this.plotOptions.markerSize;

    let metricId = this.plotOptions.metric.id;

    let statRange = this.getYStatisticalRange(metricId, xDimVal);

    let metricValues = this.dataSet.getArrayMetricValue(metricId, xDimVal.value)!.
      filter(mv => mv < statRange.min || mv > statRange.max)

    let boxOutliers = plotElt as BoxOutliers;

    if (markerColor && markerSize && metricValues) {
      boxOutliers.setDataPoints(metricValues.map(mv => new NumericPoint(xDimVal.toNumericValue(), mv)),
        this.plotOptions.animate, this.plotOptions.animationDuration);
    }
  }

  private getYStatisticalRange(metricId: string, xDimVal: DimensionValue<XDimensionType>): NumericRange {
    if (!this.statRangeByMetricId.has(metricId)) {
      this.statRangeByMetricId.set(metricId, new Map<number, NumericRange>());
    }

    let range = this.statRangeByMetricId.get(metricId)!.get(xDimVal.toNumericValue())

    if (!range) {

      let metricPoints = this.dataSet.getArrayMetricValue(metricId, xDimVal.value)!.map(y => new NumericPoint(xDimVal.toNumericValue(), y));

      let percentile25 = PercentileHelper.calculate25Percentile(metricPoints);
      let percentile75 = PercentileHelper.calculate75Percentile(metricPoints);

      let minY = PercentileHelper.calculateMinY(percentile25, percentile75);
      let maxY = PercentileHelper.calculateMaxY(percentile25, percentile75);

      range = new NumericRange(minY, maxY);

      this.statRangeByMetricId.get(metricId)!.set(xDimVal.toNumericValue(), range);
    }

    return range;
  }

  override update2DPlotElement(plotElt: PlotDrawableElement, xDimVal: DimensionValue<XDimensionType>, yDimVal: DimensionValue<Exclude<YDimensionType, undefined>>) {
    throw new Error(Plot.errors.doesntSupport2DData);
  }

  protected static createElement(metricId: string, dataPoints: Array<NumericPoint>, markerColor: Color, markerSize: number): PlotDrawableElement {
    return new BoxOutliers(metricId, dataPoints, markerColor, markerSize);
  }
}
