import {CoordinateTransformation} from "./coordinate-transformation";

export class LogPointXTransformation implements CoordinateTransformation {

  constructor(private base: number) {
    this.base = base;
  }

  applyX(x: number): number {
    return Math.log10(x);
  }

  applyY(y: number): number {
    return y;
  }

  unapplyX(x: number): number {
    return Math.pow(this.base, x);
  }

  unapplyY(y: number): number {
    return y;
  }
}
