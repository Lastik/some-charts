import merge from "lodash-es/merge";
import {MarkerPlotOptions, MarkerPlotOptionsDefaults, PlotOptionsClassFactory} from "../../../options";
import {DataSet, DimensionValue} from "../../../data";
import {DataTransformation, NumericPoint} from "../../../geometry";
import {Plot} from "../plot";
import * as Color from "color";
import {MarkerPlotOptionsClass} from "../../../options/plot/marker";
import {PlotDrawableElement} from "../plot-drawable-element";
import {MarkerPlotDrawableElement} from "./marker-plot-drawable-element";
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
    return new MarkerPlotDrawableElement(dataPoint, markerColor, markerSize);
  }

  private getMarkerSize(xDimVal: DimensionValue<XDimensionType>,
                        yDimVal: DimensionValue<Exclude<YDimensionType, undefined>> | undefined = undefined): number {
    return typeof this.plotOptions.markerSize === 'number' ? this.plotOptions.markerSize :
      this.getDependantNumericValueForMetricValue(this.plotOptions.markerSize, xDimVal, yDimVal)!;
  }

  protected add1DPlotElement(xDimension: DimensionValue<XDimensionType>): PlotDrawableElement {
    let markerColor = this.getColor(this.plotOptions.metric.color, xDimension);
    let markerSize = this.getMarkerSize(xDimension);
    let metricValue = this.dataSet.getMetricValue(this.plotOptions.metric.name, xDimension.value)!;

    let point = new NumericPoint(xDimension.toNumericValue(), metricValue);
    return MarkerPlot.createElementForMarker(point, markerColor, markerSize);
  }

  protected add2DPlotElement(xDimension: DimensionValue<XDimensionType>, yDimension: DimensionValue<Exclude<YDimensionType, undefined>>): PlotDrawableElement {
    let markerColor = this.getColor(this.plotOptions.metric.color, xDimension, yDimension);
    let markerSize =  this.getMarkerSize(xDimension, yDimension);

    let point = new NumericPoint(xDimension.toNumericValue(), yDimension.toNumericValue())!;
    return MarkerPlot.createElementForMarker(point, markerColor, markerSize);
  }

  protected update1DPlotElement(plotElt: PlotDrawableElement, xDimension: DimensionValue<XDimensionType>): PlotDrawableElement {
    let markerColor = this.getColor(this.plotOptions.metric.color, xDimension);
    let markerSize = this.getMarkerSize(xDimension);
    let metricValue = this.dataSet.getMetricValue(this.plotOptions.metric.name, xDimension.value);

    let markerPlotElt = plotElt as MarkerPlotDrawableElement;

    if (markerColor && markerSize && metricValue) {
      markerPlotElt.dataPoint = new NumericPoint(markerPlotElt.dataPoint.x, metricValue);
      markerPlotElt.size = markerSize;
      markerPlotElt.color = markerColor;
    }

    return markerPlotElt;
  }

  protected update2DPlotElement(plotElt: PlotDrawableElement, xDimension: DimensionValue<XDimensionType>, yDimension: DimensionValue<Exclude<YDimensionType, undefined>>): PlotDrawableElement {
    let markerColor = this.getColor(this.plotOptions.metric.color, xDimension, yDimension);
    let markerSize =  this.getMarkerSize(xDimension, yDimension);

    let point = new NumericPoint(xDimension.toNumericValue(), yDimension.toNumericValue())!;

    let markerPlotElt = plotElt as MarkerPlotDrawableElement;
    markerPlotElt.dataPoint = point;
    markerPlotElt.size = markerSize;
    markerPlotElt.color = markerColor;

    return markerPlotElt;
  }
}
