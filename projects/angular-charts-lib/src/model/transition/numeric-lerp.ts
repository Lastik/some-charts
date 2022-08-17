import {Lerp} from "./lerp";

export class NumericLerp implements Lerp<number>{
  apply(start: number, end: number, weight: number): number {
    return start * (1 - weight) + end * weight;
  }
}
