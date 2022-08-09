import extend from "lodash-es/extend";
import {Context} from "konva/lib/Context";
import {Shape, ShapeConfig} from "konva/lib/Shape";
import {MarkerPlotOptions, MarkerPlotOptionsDefaults} from "../index";
import {DataSet, DimensionValue} from "../data";
import {DataTransformation, NumericPoint} from "../index";
import {Plot} from "./plot";
import * as Color from "color";

export class MarkerPlot<TItemType,
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined>
  extends Plot<MarkerPlotOptions, TItemType, XDimensionType, YDimensionType> {

  constructor(
    dataSet: DataSet<TItemType, XDimensionType, YDimensionType>,
    dataTransformation: DataTransformation,
    options: MarkerPlotOptions) {
    super(dataSet, dataTransformation, options);

    this.plotOptions = extend(MarkerPlotOptionsDefaults.Instance, options);
  }

  protected draw1DData(context: Context, shape: Shape<ShapeConfig>, xDimension: readonly DimensionValue<XDimensionType>[]): void {

    let metricValues = this.dataSet.getMetricValues(this.plotOptions.metric.name) as number[];

    if (this.screen) {
      let screenLocation = this.screen.getMinXMinY();

      xDimension.forEach((xDimVal) => {

        let markerColor = this.getColor(this.plotOptions.metric.color, xDimVal);
        let markerSize = this.getMarkerSize(xDimVal);

        if (markerColor && markerSize) {
          let metricValue = metricValues[xDimVal.index];
          let point = new NumericPoint(xDimVal.toNumericValue(), metricValue);
          this.drawMarker(context, point, markerColor, markerSize, screenLocation);
        }
      });

      context.stroke();
    }
  }

  protected draw2DData(context: Context, shape: Shape<ShapeConfig>, xDimension: readonly DimensionValue<XDimensionType>[], yDimension: readonly DimensionValue<Exclude<YDimensionType, undefined>>[]): void {

    if(this.screen) {
      let screenLocation = this.screen.getMinXMinY();

      xDimension.forEach((xDimVal) => {
        yDimension.forEach((yDimVal) => {

          let markerColor = this.getColor(this.plotOptions.metric.color, xDimVal, yDimVal);
          let markerSize =  this.getMarkerSize(xDimVal, yDimVal);

          if(markerColor && markerSize) {
            let point = new NumericPoint(xDimVal.toNumericValue(), yDimVal.toNumericValue());
            this.drawMarker(context, point, markerColor, markerSize, screenLocation);
          }
        });
      });

      context.stroke();
    }
  }

  private drawMarker(context: Context, location: NumericPoint, markerColor: Color, markerSize: number, screenLocation: NumericPoint) {
    let markerScreenLocation = this.dataTransformation.dataToScreenXY(location, this.visible!, this.screen!.getSize());
    markerScreenLocation.x += screenLocation.x;
    markerScreenLocation.y += screenLocation.y;

    context.beginPath();
    context.arc(markerScreenLocation.x, markerScreenLocation.y, markerSize, 0, Math.PI * 2, true);
    context.setAttr('fillStyle', markerColor.toString());
    context.fill();
    context.setAttr('lineWidth', 1);
    context.stroke();
  }

  private getMarkerSize(xDimVal: DimensionValue<XDimensionType>,
                        yDimVal: DimensionValue<Exclude<YDimensionType, undefined>> | undefined = undefined): number | undefined {
    return typeof this.plotOptions.markerSize === 'number' ? this.plotOptions.markerSize :
      this.getDependantNumericValueForMetricValue(this.plotOptions.markerSize, xDimVal, yDimVal)
  }
}
