import * as Color from "color";
import {NumericPoint} from "../geometry";

export interface Lerp<T extends Color | number | NumericPoint> {
  apply(start: T, end: T, weight: number): T;
}
