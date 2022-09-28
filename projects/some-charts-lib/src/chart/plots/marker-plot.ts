import extend from "lodash-es/extend";
import Konva from "konva";
import {MarkerPlotOptions, MarkerPlotOptionsDefaults, PlotOptionsClassFactory} from "../../options";
import {DataSet, DimensionValue} from "../../data";
import {DataTransformation, NumericPoint} from "../../geometry";
import {Plot} from "./plot";
import * as Color from "color";
import {MarkerPlotOptionsClass} from "../../options/plot/marker";

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

  protected create1DPlotShapes(xDimension: readonly DimensionValue<XDimensionType>[]): Konva.Shape[] {

    let metricValues = this.dataSet.getMetricValues(this.plotOptions.metric.name) as number[];

    let shapes: Konva.Shape[] = [];

    xDimension.forEach((xDimVal) => {

      let markerColor = this.getColor(this.plotOptions.metric.color, xDimVal);
      let markerSize = this.getMarkerSize(xDimVal);

      if (markerColor && markerSize) {
        let metricValue = metricValues[xDimVal.index];
        let point = new NumericPoint(xDimVal.toNumericValue(), metricValue);
        shapes.push(MarkerPlot.createShapeForMarker(point, markerColor, markerSize));
      }
    });

    return shapes;
  }

  protected create2DPlotShapes(xDimension: readonly DimensionValue<XDimensionType>[], yDimension: readonly DimensionValue<Exclude<YDimensionType, undefined>>[]): Konva.Shape[] {

    let shapes: Konva.Shape[] = [];

    xDimension.forEach((xDimVal) => {
      yDimension.forEach((yDimVal) => {

        let markerColor = this.getColor(this.plotOptions.metric.color, xDimVal, yDimVal);
        let markerSize =  this.getMarkerSize(xDimVal, yDimVal);

        if(markerColor && markerSize) {
          let point = new NumericPoint(xDimVal.toNumericValue(), yDimVal.toNumericValue());
          shapes.push(MarkerPlot.createShapeForMarker(point, markerColor, markerSize));
        }
      });
    });

    return shapes;
  }

  private static createShapeForMarker(location: NumericPoint, markerColor: Color, markerSize: number): Konva.Shape {
    let circle = new Konva.Circle({
      radius: markerSize,
      fill: markerColor.toString(),
      stroke: 'black',
      strokeWidth: 1
    });

    circle.setAttr('markerDataLocation', location);

    return circle;
  }

  private getMarkerSize(xDimVal: DimensionValue<XDimensionType>,
                        yDimVal: DimensionValue<Exclude<YDimensionType, undefined>> | undefined = undefined): number | undefined {
    return typeof this.plotOptions.markerSize === 'number' ? this.plotOptions.markerSize :
      this.getDependantNumericValueForMetricValue(this.plotOptions.markerSize, xDimVal, yDimVal)
  }
}
