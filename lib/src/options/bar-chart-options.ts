import {ChartOptions} from "./chart-options";
import {FontInUnits} from "../model/font/font-in-units";
/**
 * Chart renderer options
 */
export interface BarChartOptions extends ChartOptions{
  /**
   * True, if labels must be drawn on bars. Otherwise, false.
   */
  drawLabelsOnBars: boolean;
  /**
   * Bars labels font.
   */
  labelsFont: FontInUnits;
  /**
   * Bars labels foreground color.
   */
  labelsForegroundColor: string;
  /**
   * Bars labels precision.
   */
  labelsPrecision: number;
}
