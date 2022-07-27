import extend from "lodash-es/extend";
import {Context} from "konva/lib/Context";
import {Shape, ShapeConfig} from "konva/lib/Shape";
import {MarkerPlotOptions, MarkerPlotOptionsDefaults} from "../../model";
import {DataSet, DimensionValue} from "../data";
import {DataTransformation, NumericPoint} from "../../model";
import {Plot} from "./plot";

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

  protected draw1DData(context: Context, shape: Shape<ShapeConfig>, xDimension: readonly DimensionValue<XDimensionType>[], metricValues: number[]): void {

    if (this.screen && this.visible) {
      let screenLocation = this.screen.getMinXMinY();

      xDimension.forEach((xDimVal) => {
        let metricValue = metricValues[xDimVal.index];
        let point = new NumericPoint(xDimVal.toNumericValue(), metricValue);
        let pointLocation = this.dataTransformation.dataToScreenXY(point, this.visible!, this.screen!.getSize());
        pointLocation.x += screenLocation.x;
        pointLocation.y += screenLocation.y;

        context.beginPath();
        context.arc(pointLocation.x, pointLocation.y, this.plotOptions.markerSize, 0, Math.PI * 2, true);
        context.setAttr('fillStyle', this.plotOptions.markerFill);
        context.fill();
        context.setAttr('lineWidth', 1);
        context.stroke();

      });

      context.stroke();
    }
  }

  protected draw2DData(context: Context, shape: Shape<ShapeConfig>, xDimension: readonly DimensionValue<XDimensionType>[], yDimension: readonly DimensionValue<Exclude<YDimensionType, undefined>>[], metricValues: number[][]): void {

    if(this.screen) {
      let screenLocation = this.screen.getMinXMinY();

      for (let i = 0; i < dataSource.length; i++) {
        let point = dataSource[i];
        let pointLocation = CoordinateTransform.dataToScreenXY(point, self._visible, screenSize);

        pointLocation.x += screenLocation.x;
        pointLocation.y += screenLocation.y;

        context.beginPath();
        context.arc(pointLocation.x, pointLocation.y, self.markerSize, 0, Math.PI * 2, true);
        context.fillStyle = self.markerFill;
        context.fill();
        context.lineWidth = 1;
        context.stroke();
      }

      context.stroke();
    }
  }
}
