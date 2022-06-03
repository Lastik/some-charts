import {EventBase} from "./event-base";
import {EventType} from "./event-type";

export class DragEvent implements EventBase {

  /**
   * Event type;
   */
  readonly type: EventType;

  /**
   * Drag delta X.
   */
  public readonly deltaX: number;

  /**
   * Drag delta X.
   */
  public readonly deltaY: number;

  /**
   * Creates event of chart dragging.
   * @param {number} deltaX - X coordinate of drag delta.
   * @param {number} deltaY - Y coordinate of drag delta.
   */
  constructor(deltaX: number, deltaY: number){
    this.type = EventType.Dragging;
    this.deltaX = deltaX;
    this.deltaY = deltaY;
  }
}
