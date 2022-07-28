import {Range} from '../range';
import * as Color from 'color';

export class Transition<OutputType extends Color | number> {
  to: Range<OutputType>;
  clipping: Range<OutputType>

  constructor(to: Range<OutputType>, clipping: Range<OutputType> | undefined) {
    this.to = to;
    this.clipping = clipping ?? to;
  }

  apply(from: Range<number>, value: number): OutputType {
    if (this.to.min instanceof Color) {
      return this.transitionToColor(from, value);
    } else {
      return this.transitionToNumber(from, value);
    }
  }

  protected transitionToColor(from: Range<number>, value: number): Color{

  }

  protected transitionToNumber(from: Range<number>, value: number): number{

  }
}
