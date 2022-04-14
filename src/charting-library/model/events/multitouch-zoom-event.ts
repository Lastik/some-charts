import {DataRect} from "../data-rect";
import {EventBase} from "./event-base";

export class MultitouchZoomEvent extends EventBase{
  /**
   * Rectangle for previous touch.
   */
  public readonly prevRect: DataRect;

  /**
   * Rectangle for current touch.
   */
  public readonly curRect: DataRect;

  /**
   * Represents event occurring on multitouch navigation.
   * @param {DataRect} prevRect - Rectangle for previous touch.
   * @param {DataRect} curRect - Rectangle for current touch.
   */
  constructor(prevRect: DataRect, curRect: DataRect){
    super(EventType.MultitouchZooming);
    this.prevRect = prevRect;
    this.curRect = curRect;
  }
}
