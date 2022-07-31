import {Range} from '../range';
import * as Color from 'color';
import {ColorLerp} from "./color-lerp";
import {Lerp} from "./lerp";

export class Transition<OutputType extends Color | number> {
  to: Range<OutputType>;

  constructor(to: Range<OutputType>) {
    this.to = to;
  }

  apply(from: Range<number>, value: number): OutputType {
    if (this.to.min instanceof Color) {
      return this.transitionToColor(from, value);
    } else {
      return this.transitionToNumber(from, value);
    }
  }

  protected transitionToColor(from: Range<number>, value: number, to: Range<Color>): Color{
    let degree = value / (from.max - from.min);
    return ColorLerp.apply(to.min, to.max, degree);
  }

  protected transitionToNumber(from: Range<number>, value: number, to: Range<number>): number{
    let degree = value / (from.max - from.min);
    return Lerp.apply(to.min, to.max, degree);
  }
}
