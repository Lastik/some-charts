import {Font} from "../../../font";
import {PlotOptions} from "../plot-options";
import {PlotKind} from "../plot-kind";
import {MetricOptions} from "../metric-options";
import * as Color from "color";

/**
 * Bars plot options
 */
export interface BarsPlotOptions extends PlotOptions {
  /**
  * Array of metrics options.
  * */
  metrics: Array<MetricOptions<Color>>;
  /**
   * True, if labels must be drawn on bars. Otherwise, false.
   */
  drawLabelsOnBars?: boolean;
  /**
   * Bars labels precision.
   */
  labelsPrecision?: number;
  /**
   * True, if plot border must be darker than plot background. Otherwise, must be false.
   */
  useDarkerBorder?: boolean;
  /**
   * Font
   */
  font?: Font;
  /**
   * Foreground color
   */
  foregroundColor?: Color;
}

export class BarsPlotOptionsDefaults
{
  private static _instance: BarsPlotOptions = {
    metrics: [],
    kind: PlotKind.Bars,
    drawLabelsOnBars: true,
    labelsPrecision: 2,
    useDarkerBorder: false,
    font: {
      family: 'Calibri',
      size: 13
    },
    foregroundColor: new Color("white"),
    animate: false,
    animationDuration: 600
  }

  public static get Instance()
  {
    return this._instance;
  }
}
