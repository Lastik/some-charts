import {CoordinateTransformation} from "./coordinate-transformation";

export class Log10PointXTransformation implements CoordinateTransformation {
  applyX(x: number): number {
    return Math.log10(x);
  }

  applyY(y: number): number {
    return y;
  }

  unapplyX(x: number): number {
    return Math.pow(10, x);
  }

  unapplyY(y: number): number {
    return y;
  }
}
