import Konva from "konva";
import {DataTransformation, NumericDataRect, NumericPoint} from "../../geometry";
import {TextMeasureUtils} from "../../services";
import {AnimatedProperty} from "./animated-property";
import {isEqual} from "lodash-es";
import {ACEventTarget} from "../../events";
import {AnimationEventType} from "./event";
import {IDisposable} from "../../i-disposable";

export class PlotDrawableElement<DrawableType extends Konva.Group | Konva.Shape = Konva.Group | Konva.Shape> implements IDisposable {

  public readonly eventTarget: ACEventTarget<AnimationEventType>;

  public readonly dataPoint: AnimatedProperty<NumericPoint>;

  protected get animatedProperties(): Array<AnimatedProperty<any>>{
    return [this.dataPoint];
  };

  private get isAnimationInProcess(): boolean{
    return !this.animatedProperties.every(p => !p.isAnimationInProcess);
  };

  private runningAnimationsIds: Array<number> = [];
  private runningAnimation: Konva.Animation | undefined;

  constructor(public readonly metricName: string,
              dataPoint: NumericPoint, public readonly rootDrawable: DrawableType,
              protected textMeasureUtils: TextMeasureUtils = TextMeasureUtils.Instance) {
    this.dataPoint = new AnimatedProperty(dataPoint);
    this.rootDrawable = rootDrawable;

    this.eventTarget = new ACEventTarget<AnimationEventType>();
  }

  updateShapes(dataTransformation: DataTransformation, visible: NumericDataRect, screen: NumericDataRect): void {

    let animationsIds = this.animatedProperties.map(p => p.animationId).filter(v => v !== undefined) as Array<number>;

    if (!this.isAnimationInProcess || isEqual(this.runningAnimationsIds, animationsIds)) {
      this.updateRootDrawableRenderLocation(this.dataPoint.animatedValue, dataTransformation, visible, screen);
      this.updateShapesInStatic(this.dataPoint.animatedValue, dataTransformation, visible, screen);
    } else {
      let self = this;

      if(this.runningAnimation){
        this.runningAnimation.stop();
      }

      this.runningAnimation = new Konva.Animation(function (frame) {

        self.tickAnimations(frame?.time);

        self.updateRootDrawableRenderLocation(self.dataPoint.animatedValue, dataTransformation, visible, screen);
        self.updateShapesInStatic(self.dataPoint.animatedValue, dataTransformation, visible, screen);

        self.eventTarget.fireEvent({type: AnimationEventType.Tick});

        if(!self.isAnimationInProcess){
          self.runningAnimation?.stop();
          self.runningAnimation = undefined;
        }
      }, this.rootDrawable.getLayer());
      this.runningAnimation.start();
      this.runningAnimationsIds = animationsIds;
    }
  }

  protected updateShapesInStatic(dataPoint: NumericPoint, dataTransformation: DataTransformation, visible: NumericDataRect, screen: NumericDataRect): void {}

  private tickAnimations(time: number | undefined) {
    this.animatedProperties.forEach(p => {
      if (p.isAnimationInProcess) {
        p.tick(time)
      }
    });
  }

  private updateRootDrawableRenderLocation(dataPoint: NumericPoint, dataTransformation: DataTransformation, visible: NumericDataRect, screen: NumericDataRect): void {
    let screenLocation = this.getLocationOnScreen(dataPoint, dataTransformation, visible, screen);
    this.rootDrawable.setPosition(screenLocation);
  }

  protected getLocationOnScreen(dataPoint: NumericPoint, dataTransformation: DataTransformation, visible: NumericDataRect, screen: NumericDataRect){
    return dataTransformation.dataToScreenRegionXY(dataPoint, visible, screen);
  }

  dispose() {
    this.rootDrawable.destroy();
    this.eventTarget.dispose();
  }

  getBoundingRectangle(): NumericDataRect {

    let animatedDataPoint = this.dataPoint.animatedValue;

    return new NumericDataRect(animatedDataPoint.x, animatedDataPoint.x, animatedDataPoint.y, animatedDataPoint.y);
  }
}
