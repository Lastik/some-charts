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
