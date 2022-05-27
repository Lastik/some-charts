import { NumericPoint } from "../point/numeric-point";
import {PointTransformation} from "./point-transformation";

export class Log10PointXTransformation implements PointTransformation {
  Apply(point: NumericPoint): NumericPoint {
    return new NumericPoint(Math.log10(point.x), point.y);
  }

  ReverseApply(point: NumericPoint): NumericPoint {
    return new NumericPoint(Math.pow(10, point.x), point.y);
  }
}
