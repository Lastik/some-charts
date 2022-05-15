/**
 * Chart renderer options
 */
import {FontInPx} from "../model/font/font-in-px";


export interface AxisOptions {
  /**
   * Axis foreground color
   */
  foregroundColor: string;
  /**
   * Axis background color
   */
  backgroundColor: string;
  /**
   * Axis font
   */
  font: FontInPx;
  /**
   * Height of axis major ticks
   */
  majorTickHeight: number;
  /**
   * Height of axis minor ticks
   */
  minorTickHeight: number;
  /**
   * True, if axis border must be drawn. Otherwise, false.
   */
  drawBorder: boolean;
}

export class AxisOptionsDefaults
{
  private static _instance: AxisOptions = {
    foregroundColor: 'white',
    backgroundColor: '#111111',
    font: {
      size: 13,
      family: 'Calibri'
    },
    majorTickHeight: 6,
    minorTickHeight: 3,
    drawBorder: false
  }

  public static get Instance()
  {
    return this._instance;
  }
}
