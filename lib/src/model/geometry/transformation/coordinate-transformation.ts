import {
  AxesOptions,
  NumericAxisLogarithmicScale,
  NumericAxisOptions,
  NumericAxisScaleType
} from "../../options";
import {LogPointXTransformation} from "./log-point-x-transformation";
import {LogPointYTransformation} from "./log-point-y-transformation";
import {CompositeTransformation} from "./composite-transformation";
import {AxisTypes} from "../../chart/axis";

export interface CoordinateTransformation {
  applyX(x: number): number;
  applyY(y: number): number;

  unapplyX(x: number): number;
  unapplyY(y: number): number;
}

export class CoordinateTransformationStatic {
  static buildFromOptions(axesOptions: AxesOptions): CoordinateTransformation | undefined {

    let axesCoordinateTransformations: Array<CoordinateTransformation> = [];

    let horizontalAxisOptions = axesOptions.horizontal;
    let verticalAxisOptions = axesOptions.vertical;

    if (horizontalAxisOptions.axisType == AxisTypes.NumericAxis) {
      let numericAxisOptions = horizontalAxisOptions as NumericAxisOptions;

      if (numericAxisOptions.scale.scaleType === NumericAxisScaleType.Logarithmic) {
        let logarithmicScale = numericAxisOptions.scale as NumericAxisLogarithmicScale;
        axesCoordinateTransformations.push(new LogPointXTransformation(logarithmicScale.logarithmBase));
      }
    } else if (horizontalAxisOptions.axisType == AxisTypes.LabeledAxis) {
      let numericAxisOptions = verticalAxisOptions as NumericAxisOptions;

      if (numericAxisOptions.scale.scaleType === NumericAxisScaleType.Logarithmic) {
        let logarithmicScale = numericAxisOptions.scale as NumericAxisLogarithmicScale;
        axesCoordinateTransformations.push(new LogPointYTransformation(logarithmicScale.logarithmBase));
      }
    }

    if (axesCoordinateTransformations.length == 0) {
      return undefined
    } else if (axesCoordinateTransformations.length == 1) {
      return axesCoordinateTransformations[0];
    } else {
      return new CompositeTransformation(axesCoordinateTransformations);
    }
  }
}
