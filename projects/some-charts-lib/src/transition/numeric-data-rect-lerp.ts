import {Lerp} from "./lerp";
import {NumericLerp} from "./numeric-lerp";
import {NumericDataRect} from "../geometry";

export class NumericDataRectLerp implements Lerp<NumericDataRect> {
  apply(start: NumericDataRect, end: NumericDataRect, weight: number): NumericDataRect {

    let numericLerp = new NumericLerp();

    return new NumericDataRect(
      numericLerp.apply(start.minX, end.minX, weight),
      numericLerp.apply(start.maxX, end.maxX, weight),
      numericLerp.apply(start.minY, end.minY, weight),
      numericLerp.apply(start.maxY, end.maxY, weight),
    );
  }
}
