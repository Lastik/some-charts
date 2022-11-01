import * as Color from "color";
import {NumericPoint, Range} from "../../geometry";
import {Transition} from "../../transition";

export class AnimatedProperty<PropertyType extends Color | number | NumericPoint | undefined> {

  _isAnimationInProcess: boolean;

  private startValue: PropertyType | undefined;
  private endValue: PropertyType | undefined;

  private _animatedValue: PropertyType;
  private _actualValue: PropertyType;
  private _animationDuration: number | undefined;

  private transition: Transition<Exclude<PropertyType, undefined>> | undefined;

  public get animatedValue(): PropertyType {
    return this._animatedValue;
  }

  public get actualValue(): PropertyType {
    return this._actualValue;
  }

  public get animationDuration(): number | undefined {
    return this._animationDuration;
  }

  public get isAnimationInProcess(): boolean {
    return this._isAnimationInProcess;
  }

  constructor(value: PropertyType) {
    this._animatedValue = this._actualValue = value;
    this._isAnimationInProcess = false;
  }

  setValue(value: PropertyType, animate: boolean = false, animationDuration: number = 800) {
    if (animate && this.isAnimationInProcess) {
      throw new Error('Animation is in process, so setting value is unsupported!');
    }
    if (!animate) {
      this._actualValue = value;
      this._animatedValue = value;
    } else {
      this._animationDuration = animationDuration;
      this.startAnimation(value);
    }
  }

  private startAnimation(endValue: PropertyType) {
    this.startValue = this._animatedValue;
    this.endValue = endValue;
    this._isAnimationInProcess = true;
    this.transition = new Transition<Exclude<PropertyType, undefined>>(new Range<Exclude<PropertyType, undefined>>(
      this.startValue as Exclude<PropertyType, undefined>,
      this.endValue as Exclude<PropertyType, undefined>));
  }

  tick(time: number) {

    if (!this.isAnimationInProcess) {
      throw new Error('Animation is not in process!');
    }

    let passedTimeRatio = time / this.animationDuration!;

    if (passedTimeRatio >= 1) {
      this._animatedValue = this.endValue!;
      this.startValue = undefined;
      this.endValue = undefined;
      this.transition = undefined;
      this._isAnimationInProcess = false;
    } else {
      this._animatedValue = this.transition!.apply(new Range<number>(0, 1), passedTimeRatio);
    }
  }
}
