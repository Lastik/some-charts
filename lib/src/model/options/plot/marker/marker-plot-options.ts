import {TextOptions} from "../../common";
import {FontUnits} from "../../../font";
import {PlotOptions} from "../plot-options";
import {PlotKind} from "../plot-kind";
import * as Color from "color";
import {Range} from "../../../index";

/**
 * Marker plot options
 */
export interface MarkerPlotOptions extends PlotOptions, TextOptions {
  /**
   * Marker size.
   */
  markerFill: Color | Range<Color>;
  /**
   * Marker fill.
   */
  markerSize: number | Range<number>;
}

export class MarkerPlotOptionsDefaults
{
  private static _instance: MarkerPlotOptions = {
    metric: "",
    markerFill: new Color("blue"),
    markerSize: 5,
    caption: "",
    color: "",
    kind: PlotKind.Bars,
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
