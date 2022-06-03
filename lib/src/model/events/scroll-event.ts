import {EventBase} from "./event-base";
import {EventType} from "./event-type";

export class ScrollEvent implements EventBase{
  /**
   * Event type;
   */
  readonly type: EventType;
  /**
   * Scroll delta.
   */
  public readonly delta: number;
  /**
   * Creates event of chart scrolling.
   * @param {number} delta - Scroll delta.
   */
  constructor(delta: number){
    this.type = EventType.Scrolling;
    this.delta = delta;
  }
}
