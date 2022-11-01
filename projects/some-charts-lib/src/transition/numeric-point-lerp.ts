import * as Color from "color";
import {Lerp} from "./lerp";
import {NumericLerp} from "./numeric-lerp";
import {NumericPoint} from "../geometry";

export class NumericPointLerp implements Lerp<NumericPoint> {
  apply(start: NumericPoint, end: NumericPoint, weight: number): NumericPoint {

    let numericLerp = new NumericLerp();

    return new NumericPoint(
      numericLerp.apply(start.x, end.x, weight),
      numericLerp.apply(start.y, end.y, weight)
    );
  }
}
