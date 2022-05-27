import { NumericPoint } from "../point/numeric-point";
import {PointTransformation} from "./point-transformation";

export class Log10PointYTransformation implements PointTransformation {
  Apply(point: NumericPoint): NumericPoint {
    return new NumericPoint(point.x, Math.log10(point.y));
  }

  ReverseApply(point: NumericPoint): NumericPoint {
    return new NumericPoint(point.x, Math.pow(10, point.y));
  }
}
