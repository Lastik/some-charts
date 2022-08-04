import * as Color from "color";

export interface Lerp<T extends Color | number> {
  apply(start: T, end: T, weight: number): T;
}
