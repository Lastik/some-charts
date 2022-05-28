import {CoordinateTransformation} from "./coordinate-transformation";

export class Log10PointYTransformation implements CoordinateTransformation {
  applyX(x: number): number {
    return x;
  }

  applyY(y: number): number {
    return Math.log10(y);
  }

  unapplyX(x: number): number {
    return x;
  }

  unapplyY(y: number): number {
    return Math.pow(10, y);
  }
}
