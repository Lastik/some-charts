import {EventBase} from "./event-base";

export class ScrollEvent extends EventBase{
  /**
   * Scroll delta.
   */
  public readonly delta: number;
  /**
   * Creates event of chart scrolling.
   * @param {number} delta - Scroll delta.
   */
  constructor(delta: number){
    super(EventType.Scrolling);
    this.delta = delta;
  }
}
