import * as Color from "color";
import {NumericDataRect, NumericPoint, Range} from "../../geometry";
import {Transition} from "../../transition";

export class AnimatedProperty<PropertyType extends Color | number | NumericPoint | NumericDataRect | undefined> {

  private prevAnimationId: number | undefined;
  private _animationId: number | undefined;
  private _isAnimationInProcess: boolean;

  private animationStartValue: PropertyType | undefined;
  private animationEndValue: PropertyType | undefined;

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

  public get animationId(): number | undefined {
    return this._animationId;
  }

  constructor(value: PropertyType) {
    this._animatedValue = this._actualValue = value;
    this._isAnimationInProcess = false;
  }

  setValue(value: PropertyType, animate: boolean = false, animationDuration: number = 800) {
    this._actualValue = value;
    if (!animate) {
      if(this.isAnimationInProcess){
        this.stopAnimation();
      }
      else {
        this._animatedValue = value;
      }
    } else {
      this._animationDuration = animationDuration;
      this.startAnimation();
    }
  }

  private stopAnimation(){
    this.animationStartValue = undefined;
    this.animationEndValue = undefined;
    this._animationDuration = undefined
    this._isAnimationInProcess = false;
    this.transition = undefined;
    this.prevAnimationId = this._animationId;
    this._animatedValue = this._actualValue;
  }

  private startAnimation() {
    this.animationStartValue = this._animatedValue;
    this.animationEndValue = this._actualValue;
    this._isAnimationInProcess = true;
    this._animationId = this.prevAnimationId ? this.prevAnimationId + 1 : 1;
    this.transition = new Transition<Exclude<PropertyType, undefined>>(new Range<Exclude<PropertyType, undefined>>(
      this.animationStartValue as Exclude<PropertyType, undefined>,
      this.animationEndValue as Exclude<PropertyType, undefined>));
  }

  tick(time: number | undefined) {

    if (!this.isAnimationInProcess) {
      throw new Error('Animation is not in process!');
    }

    let passedTimeRatio = (time ?? this.animationDuration!) / this.animationDuration!;

    if (passedTimeRatio >= 1) {
      this.stopAnimation();
    } else {
      this._animatedValue = this.transition!.apply(new Range<number>(0, 1), passedTimeRatio);
    }
  }
}
