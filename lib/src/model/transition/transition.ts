import {Range} from '../range';
import * as Color from 'color';
import {ColorLerp} from "./color-lerp";
import {NumericLerp} from "./numeric-lerp";

export class Transition<OutputType extends Color | number> {
  to: Range<OutputType>;

  private static readonly numericLerp: NumericLerp = new NumericLerp();
  private static readonly colorLerp: ColorLerp = new ColorLerp();

  constructor(to: Range<OutputType>) {
    this.to = to;
  }

  apply(from: Range<number>, value: number): OutputType {
    if (this.to.min instanceof Color) {
      return <OutputType>this.transitionToColor(from, value, <Range<Color>>this.to);
    } else {
      return <OutputType>this.transitionToNumber(from, value, <Range<number>>this.to);
    }
  }

  protected transitionToColor(from: Range<number>, value: number, to: Range<Color>): Color{
    let degree = value / (from.max - from.min);
    return Transition.colorLerp.apply(to.min, to.max, degree);
  }

  protected transitionToNumber(from: Range<number>, value: number, to: Range<number>): number{
    let degree = value / (from.max - from.min);
    return Transition.numericLerp.apply(to.min, to.max, degree);
  }
}
