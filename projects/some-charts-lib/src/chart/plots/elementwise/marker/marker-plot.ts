import merge from "lodash-es/merge";
import {MarkerPlotOptions, MarkerPlotOptionsDefaults, PlotOptionsClassFactory} from "../../../../options";
import {DataSet, DimensionValue} from "../../../../data";
import {DataTransformation, NumericPoint} from "../../../../geometry";
import {Plot} from "../../plot";
import * as Color from "color";
import {MarkerPlotOptionsClass} from "../../../../options/plot/marker";
import {PlotDrawableElement} from "../plot-drawable-element";
import {Marker} from "./marker";
import {cloneDeep} from "lodash-es";
import {ElementwisePlot} from "../elementwise-plot";

export class MarkerPlot<TItemType,
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined>
  extends ElementwisePlot<MarkerPlotOptions, MarkerPlotOptionsClass, TItemType, XDimensionType, YDimensionType> {

  constructor(
    dataSet: DataSet<TItemType, XDimensionType, YDimensionType>,
    dataTransformation: DataTransformation,
    options: MarkerPlotOptions) {
    super(dataSet, dataTransformation, options);

    this.plotOptions = PlotOptionsClassFactory.buildPlotOptionsClass(merge(cloneDeep(MarkerPlotOptionsDefaults.Instance), options)) as MarkerPlotOptionsClass;
  }

  private static createElementForMarker(metricId: string, dataPoint: NumericPoint, markerColor: Color, markerSize: number): PlotDrawableElement {
    return new Marker(metricId, dataPoint, markerColor, markerSize);
  }

  private getMarkerSize(xDimVal: DimensionValue<XDimensionType>,
                        yDimVal: DimensionValue<Exclude<YDimensionType, undefined>> | undefined = undefined): number {
    return typeof this.plotOptions.markerSize === 'number' ? this.plotOptions.markerSize :
      this.getDependantNumericValueForMetricValue(this.plotOptions.markerSize, xDimVal, yDimVal)!;
  }

  protected add1DPlotElement(xDimVal: DimensionValue<XDimensionType>): [PlotDrawableElement] {

    let metricId = this.plotOptions.metric.id;

    let markerColor = this.getColor(this.plotOptions.metric.color, xDimVal);
    let markerSize = this.getMarkerSize(xDimVal);
    let metricValue = this.dataSet.getMetricValue(metricId, xDimVal.value)!;

    let point = new NumericPoint(xDimVal.toNumericValue(), metricValue);
    return [MarkerPlot.createElementForMarker(metricId, point, markerColor, markerSize)];
  }

  protected add2DPlotElement(xDimVal: DimensionValue<XDimensionType>, yDimVal: DimensionValue<Exclude<YDimensionType, undefined>>): [PlotDrawableElement] {

    let metricId = this.plotOptions.metric.id;

    let markerColor = this.getColor(this.plotOptions.metric.color, xDimVal, yDimVal);
    let markerSize = this.getMarkerSize(xDimVal, yDimVal);

    let point = new NumericPoint(xDimVal.toNumericValue(), yDimVal.toNumericValue());
    return [MarkerPlot.createElementForMarker(metricId, point, markerColor, markerSize)];
  }

  protected update1DPlotElement(plotElt: PlotDrawableElement, xDimVal: DimensionValue<XDimensionType>) {
    let markerColor = this.getColor(this.plotOptions.metric.color, xDimVal);
    let markerSize = this.getMarkerSize(xDimVal);
    let metricValue = this.dataSet.getMetricValue(this.plotOptions.metric.id, xDimVal.value);

    let marker = plotElt as Marker;

    if (markerColor && markerSize && metricValue) {
      marker.dataPoint.setValue(new NumericPoint(marker.dataPoint.actualValue.x, metricValue),
        this.plotOptions.animate, this.plotOptions.animationDuration);
      marker.size = markerSize;
      marker.color = markerColor;
    }
  }

  protected update2DPlotElement(plotElt: PlotDrawableElement, xDimVal: DimensionValue<XDimensionType>, yDimVal: DimensionValue<Exclude<YDimensionType, undefined>>) {
    let markerColor = this.getColor(this.plotOptions.metric.color, xDimVal, yDimVal);
    let markerSize =  this.getMarkerSize(xDimVal, yDimVal);

    let point = new NumericPoint(xDimVal.toNumericValue(), yDimVal.toNumericValue());

    let marker = plotElt as Marker;
    marker.dataPoint.setValue(point,
      this.plotOptions.animate, this.plotOptions.animationDuration);
    marker.size = markerSize;
    marker.color = markerColor;
  }
}
