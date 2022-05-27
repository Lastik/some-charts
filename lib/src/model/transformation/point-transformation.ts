import { NumericPoint } from "../point/numeric-point";

export interface PointTransformation {
  Apply(point: NumericPoint): NumericPoint;

  ReverseApply(point: NumericPoint): NumericPoint;
}
