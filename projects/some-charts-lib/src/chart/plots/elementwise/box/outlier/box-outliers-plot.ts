import merge from "lodash-es/merge";
import {
  BarsPlotOptions,
  BarsPlotOptionsDefaults,
  MarkerPlotOptions,
  PlotOptionsClassFactory
} from "../../../../../options";
import {DataSet, DimensionValue} from "../../../../../data";
import {DataTransformation, NumericPoint, NumericRange} from "../../../../../geometry";
import {PlotDrawableElement} from "../../plot-drawable-element";
import {Marker} from "../../marker/marker";
import {cloneDeep} from "lodash-es";
import {
  BoxOutliersPlotOptions,
  BoxOutliersPlotOptionsDefaults
} from "../../../../../options";
import {BoxOutliersPlotOptionsClass} from "../../../../../options";
import {Plot} from "../../../plot";
import {PercentileHelper} from "../../../../../services";
import {ElementwisePlot} from "../../elementwise-plot";
import * as Color from "color";

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

  override add1DPlotElements(xDimVal: DimensionValue<XDimensionType>): PlotDrawableElement[] {

    let metricId = this.plotOptions.metric.id;

    let markerColor = this.getColor(this.plotOptions.metric.color, xDimVal);
    let markerSize = this.getMarkerSize(xDimVal);
    let metricPoints = this.dataSet.getArrayMetricValue(metricId, xDimVal.value)!.map(y => new NumericPoint(xDimVal.toNumericValue(), y));
    let statRange = this.getYStatisticalRange(metricId, xDimVal);

    return metricPoints.map((point, idx) => BoxOutliersPlot.createElement(metricId, point, markerColor, markerSize,
      idx, point.y < statRange.min || point.y > statRange.max));
  }

  override add2DPlotElements(xDimVal: DimensionValue<XDimensionType>, yDimVal: DimensionValue<Exclude<YDimensionType, undefined>>): PlotDrawableElement[] {
    throw new Error(Plot.errors.doesntSupport2DData);
  }

  override update1DPlotElement(plotElt: PlotDrawableElement, xDimVal: DimensionValue<XDimensionType>) {
    let markerColor = this.getColor(this.plotOptions.metric.color, xDimVal);
    let markerSize = this.getMarkerSize(xDimVal);

    let metricId = this.plotOptions.metric.id;

    let metricValues = this.dataSet.getArrayMetricValue(metricId, xDimVal.value)!;

    let marker = plotElt as Marker;

    let metricValue = metricValues[marker.indexInDataSetValue!]

    let statRange = this.getYStatisticalRange(metricId, xDimVal);

    if (markerColor && markerSize && metricValues) {
      marker.dataPoint.setValue(new NumericPoint(marker.dataPoint.actualValue.x, metricValue),
        this.plotOptions.animate, this.plotOptions.animationDuration);
      marker.isVisible = metricValue < statRange.min || metricValue > statRange.max;
      marker.size = markerSize;
      marker.color = markerColor;
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

  protected getMarkerSize(xDimVal: DimensionValue<XDimensionType>,
                          yDimVal: DimensionValue<Exclude<YDimensionType, undefined>> | undefined = undefined): number {
    return typeof this.plotOptions.markerSize === 'number' ? this.plotOptions.markerSize :
      this.getDependantNumericValueForMetricValue(this.plotOptions.markerSize, xDimVal, yDimVal)!;
  }

  protected static createElement(metricId: string, dataPoint: NumericPoint, markerColor: Color, markerSize: number,
                                 indexInDataSetValue: number | undefined = undefined, isVisible: boolean = true): PlotDrawableElement {
    return new Marker(metricId, dataPoint, markerColor, markerSize, indexInDataSetValue);
  }
}
