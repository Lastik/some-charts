import {CoordinateTransformation} from "./coordinate-transformation";

export class LogPointYTransformation implements CoordinateTransformation{

  private base: number;

  constructor(base: number) {
    this.base = base;
  }

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
    return Math.pow(this.base, y);
  }
}
