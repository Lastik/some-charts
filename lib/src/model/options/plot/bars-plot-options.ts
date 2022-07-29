import {TextOptions} from "../common";
import {FontUnits} from "../../font";
import {PlotOptions} from "./plot-options";
import {PlotKind} from "./plot-kind";

/**
 * Bars plot options
 */
export interface BarsPlotOptions extends PlotOptions, TextOptions {
  /**
   * True, if labels must be drawn on bars. Otherwise, false.
   */
  drawLabelsOnBars: boolean;
  /**
   * Bars labels precision.
   */
  labelsPrecision: number;
  /**
   * True, if plot border must be darker than plot background. Otherwise, must be false.
   */
  useDarkerBorder: boolean;
}

export class BarsPlotOptionsDefaults
{
  private static _instance: BarsPlotOptions = {
    metric: "",
    caption: "",
    color: "",
    kind: PlotKind.Bars,
    drawLabelsOnBars: true,
    labelsPrecision: 2,
    useDarkerBorder: false,
    font: {
      family: 'Calibri',
      size: 10,
      units: FontUnits.Points
    },
    foregroundColor:''
  }

  public static get Instance()
  {
    return this._instance;
  }
}
