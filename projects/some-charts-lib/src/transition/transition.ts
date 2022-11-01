import {Range, NumericPoint, NumericDataRect} from '../geometry';
import * as Color from 'color';
import {ColorLerp} from "./color-lerp";
import {NumericLerp} from "./numeric-lerp";
import {NumericPointLerp} from "./numeric-point-lerp";
import {NumericDataRectLerp} from "./numeric-data-rect-lerp";

export class Transition<OutputType extends Color | number | NumericPoint | NumericDataRect> {
  to: Range<OutputType>;

  private static readonly numericLerp: NumericLerp = new NumericLerp();
  private static readonly colorLerp: ColorLerp = new ColorLerp();
  private static readonly numericPointLerp: NumericPointLerp = new NumericPointLerp();
  private static readonly numericDataRectLerp: NumericDataRectLerp = new NumericDataRectLerp();

  constructor(to: Range<OutputType>) {
    this.to = to;
  }

  apply(from: Range<number>, value: number): OutputType {
    if (this.to.min instanceof Color) {
      return <OutputType>this.transitionToColor(from, value, <Range<Color>>this.to);
    } else if(this.to.min instanceof NumericPoint) {
      return <OutputType>this.transitionToNumericPoint(from, value, <Range<NumericPoint>>this.to);
    }else if(this.to.min instanceof NumericDataRect) {
      return <OutputType>this.transitionToNumericDataRect(from, value, <Range<NumericDataRect>>this.to);
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

  protected transitionToNumericPoint(from: Range<number>, value: number, to: Range<NumericPoint>): NumericPoint{
    let degree = value / (from.max - from.min);
    return Transition.numericPointLerp.apply(to.min, to.max, degree);
  }

  protected transitionToNumericDataRect(from: Range<number>, value: number, to: Range<NumericDataRect>): NumericDataRect{
    let degree = value / (from.max - from.min);
    return Transition.numericDataRectLerp.apply(to.min, to.max, degree);
  }
}
