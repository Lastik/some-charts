import {CoordinateTransformation} from "./coordinate-transformation";

export class CompositeTransformation implements CoordinateTransformation {

  private readonly transformations: Array<CoordinateTransformation>;

  constructor(transformations: Array<CoordinateTransformation>) {
    this.transformations = transformations;
  }

  applyX(x: number): number {
    let transformedX = x;
    for (let transformation of this.transformations) {
      transformedX = transformation.applyX(transformedX);
    }
    return transformedX;
  }

  applyY(y: number): number {
    let transformedY = y;
    for (let transformation of this.transformations) {
      transformedY = transformation.applyY(transformedY);
    }
    return transformedY;
  }

  unapplyX(x: number): number {
    let transformedX = x;
    for (let transformation of this.transformations) {
      transformedX = transformation.unapplyX(transformedX);
    }
    return transformedX;
  }

  unapplyY(y: number): number {
    let transformedY = y;
    for (let transformation of this.transformations) {
      transformedY = transformation.unapplyY(transformedY);
    }
    return transformedY;
  }
}
