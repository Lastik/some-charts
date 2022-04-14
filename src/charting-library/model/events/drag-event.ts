import {EventBase} from "./event-base";

export class DragEvent extends EventBase{
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
    super(EventType.Dragging);
    this.deltaX = deltaX;
    this.deltaY = deltaY;
  }
}
