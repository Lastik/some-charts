import merge from "lodash-es/merge";
import {MarkerPlotOptions, MarkerPlotOptionsDefaults, PlotOptionsClassFactory} from "../../../options";
import {DataSet, DimensionValue} from "../../../data";
import {DataTransformation, NumericPoint} from "../../../geometry";
import {Plot} from "../plot";
import * as Color from "color";
import {MarkerPlotOptionsClass} from "../../../options/plot/marker";
import {PlotDrawableElement} from "../plot-drawable-element";
import {Marker} from "./marker";
import {cloneDeep} from "lodash-es";

export class MarkerPlot<TItemType,
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined>
  extends Plot<MarkerPlotOptions, MarkerPlotOptionsClass, TItemType, XDimensionType, YDimensionType> {

  constructor(
    dataSet: DataSet<TItemType, XDimensionType, YDimensionType>,
    dataTransformation: DataTransformation,
    options: MarkerPlotOptions) {
    super(dataSet, dataTransformation, options);

    this.plotOptions = PlotOptionsClassFactory.buildPlotOptionsClass(merge(cloneDeep(MarkerPlotOptionsDefaults.Instance), options)) as MarkerPlotOptionsClass;
  }

  private static createElementForMarker(dataPoint: NumericPoint, markerColor: Color, markerSize: number): PlotDrawableElement {
    return new Marker(dataPoint, markerColor, markerSize);
  }

  private getMarkerSize(xDimVal: DimensionValue<XDimensionType>,
                        yDimVal: DimensionValue<Exclude<YDimensionType, undefined>> | undefined = undefined): number {
    return typeof this.plotOptions.markerSize === 'number' ? this.plotOptions.markerSize :
      this.getDependantNumericValueForMetricValue(this.plotOptions.markerSize, xDimVal, yDimVal)!;
  }

  protected add1DPlotElement(xDimVal: DimensionValue<XDimensionType>): PlotDrawableElement | undefined {
    let markerColor = this.getColor(this.plotOptions.metric.color, xDimVal);
    let markerSize = this.getMarkerSize(xDimVal);
    let metricValue = this.dataSet.getMetricValue(this.plotOptions.metric.name, xDimVal.value)!;

    let point = new NumericPoint(xDimVal.toNumericValue(), metricValue);
    return MarkerPlot.createElementForMarker(point, markerColor, markerSize);
  }

  protected add2DPlotElement(xDimVal: DimensionValue<XDimensionType>, yDimVal: DimensionValue<Exclude<YDimensionType, undefined>>): PlotDrawableElement | undefined {
    let markerColor = this.getColor(this.plotOptions.metric.color, xDimVal, yDimVal);
    let markerSize =  this.getMarkerSize(xDimVal, yDimVal);

    let point = new NumericPoint(xDimVal.toNumericValue(), yDimVal.toNumericValue());
    return MarkerPlot.createElementForMarker(point, markerColor, markerSize);
  }

  protected update1DPlotElement(plotElt: PlotDrawableElement, xDimVal: DimensionValue<XDimensionType>) {
    let markerColor = this.getColor(this.plotOptions.metric.color, xDimVal);
    let markerSize = this.getMarkerSize(xDimVal);
    let metricValue = this.dataSet.getMetricValue(this.plotOptions.metric.name, xDimVal.value);

    let marker = plotElt as Marker;

    if (markerColor && markerSize && metricValue) {
      marker.dataPoint = new NumericPoint(marker.dataPoint.x, metricValue);
      marker.size = markerSize;
      marker.color = markerColor;
    }
  }

  protected update2DPlotElement(plotElt: PlotDrawableElement, xDimVal: DimensionValue<XDimensionType>, yDimVal: DimensionValue<Exclude<YDimensionType, undefined>>) {
    let markerColor = this.getColor(this.plotOptions.metric.color, xDimVal, yDimVal);
    let markerSize =  this.getMarkerSize(xDimVal, yDimVal);

    let point = new NumericPoint(xDimVal.toNumericValue(), yDimVal.toNumericValue());

    let marker = plotElt as Marker;
    marker.dataPoint = point;
    marker.size = markerSize;
    marker.color = markerColor;
  }
}
