import extend from "lodash-es/extend";
import Konva from "konva";
import {MarkerPlotOptions, MarkerPlotOptionsDefaults, PlotOptionsClassFactory} from "../../options";
import {DataSet, DimensionValue} from "../../data";
import {DataRect, DataTransformation, NumericPoint} from "../../geometry";
import {Plot} from "./plot";
import * as Color from "color";
import {MarkerPlotOptionsClass} from "../../options/plot/marker";
import {PlotDrawableElement} from "./plot-drawable-element";

export class MarkerPlot<TItemType,
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined>
  extends Plot<MarkerPlotOptions, MarkerPlotOptionsClass, TItemType, XDimensionType, YDimensionType> {

  constructor(
    dataSet: DataSet<TItemType, XDimensionType, YDimensionType>,
    dataTransformation: DataTransformation,
    options: MarkerPlotOptions) {
    super(dataSet, dataTransformation, options);

    this.plotOptions = PlotOptionsClassFactory.buildPlotOptionsClass(extend(MarkerPlotOptionsDefaults.Instance, options)) as MarkerPlotOptionsClass;
  }

  protected create1DPlotElements(xDimension: readonly DimensionValue<XDimensionType>[]): PlotDrawableElement[] {

    let metricValues = this.dataSet.getMetricValues(this.plotOptions.metric.name) as number[];

    let elements: PlotDrawableElement[] = [];

    xDimension.forEach((xDimVal) => {

      let markerColor = this.getColor(this.plotOptions.metric.color, xDimVal);
      let markerSize = this.getMarkerSize(xDimVal);

      if (markerColor && markerSize) {
        let metricValue = metricValues[xDimVal.index];
        let point = new NumericPoint(xDimVal.toNumericValue(), metricValue);
        elements.push(MarkerPlot.createElementForMarker(point, markerColor, markerSize));
      }
    });

    return elements;
  }

  protected create2DPlotElements(xDimension: readonly DimensionValue<XDimensionType>[], yDimension: readonly DimensionValue<Exclude<YDimensionType, undefined>>[]): PlotDrawableElement[] {

    let elements: PlotDrawableElement[] = [];

    xDimension.forEach((xDimVal) => {
      yDimension.forEach((yDimVal) => {

        let markerColor = this.getColor(this.plotOptions.metric.color, xDimVal, yDimVal);
        let markerSize =  this.getMarkerSize(xDimVal, yDimVal);

        if(markerColor && markerSize) {
          let point = new NumericPoint(xDimVal.toNumericValue(), yDimVal.toNumericValue());
          elements.push(MarkerPlot.createElementForMarker(point, markerColor, markerSize));
        }
      });
    });

    return elements;
  }

  private static createElementForMarker(dataPoint: NumericPoint, markerColor: Color, markerSize: number): PlotDrawableElement {
    let circle = new Konva.Circle({
      radius: markerSize,
      fill: markerColor.toString(),
      stroke: 'black',
      strokeWidth: 1
    });

    return {dataPoint: dataPoint, konvaDrawable: circle};
  }

  protected updateDrawableElementShape(element: PlotDrawableElement, visible: DataRect, screen: DataRect): void {
    let markerShape = element.konvaDrawable;
    let markerScreenLocation = this.dataTransformation.dataToScreenRegionXY(element.dataPoint, visible, screen);
    markerShape.setPosition(markerScreenLocation);
  }

  private getMarkerSize(xDimVal: DimensionValue<XDimensionType>,
                        yDimVal: DimensionValue<Exclude<YDimensionType, undefined>> | undefined = undefined): number | undefined {
    return typeof this.plotOptions.markerSize === 'number' ? this.plotOptions.markerSize :
      this.getDependantNumericValueForMetricValue(this.plotOptions.markerSize, xDimVal, yDimVal)
  }
}
