import * as Color from "color";
import {NumericDataRect, NumericPoint} from "../geometry";

export interface Lerp<T extends Color | number | NumericPoint | NumericDataRect> {
  apply(start: T, end: T, weight: number): T;
}
