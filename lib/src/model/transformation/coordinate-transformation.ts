import { NumericPoint } from "../point/numeric-point";

export interface CoordinateTransformation {
  applyX(x: number): number;
  applyY(y: number): number;

  unapplyX(x: number): number;
  unapplyY(y: number): number;
}
