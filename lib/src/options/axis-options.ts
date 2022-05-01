/**
 * Chart renderer options
 */
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
  font: string;
  /**
   * Axis font height
   */
  fontHeight: number;
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
    font: '13px Calibri',
    fontHeight: 13,
    majorTickHeight: 6,
    minorTickHeight: 3,
    drawBorder: false
  }

  public static get Instance()
  {
    return this._instance;
  }
}
