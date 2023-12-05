import {NumericDataRect, NumericPoint} from "../geometry";
import {Color} from "../color";

export interface Lerp<T extends Color | number | NumericPoint | NumericDataRect> {
  apply(start: T, end: T, weight: number): T;
}
