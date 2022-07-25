import {TextOptions} from "../common";
import {FontUnits} from "../../model";
import {PlotOptions} from "./plot-options";
import {PlotKind} from "./plot-kind";

/**
 * Marker plot options
 */
export interface MarkerPlotOptions extends PlotOptions, TextOptions {
  /**
   * Marker size.
   */
  markerFill: string;
  /**
   * Marker fill.
   */
  markerSize: number;
}

export class MarkerPlotOptionsDefaults
{
  private static _instance: MarkerPlotOptions = {
    markerFill: "blue",
    markerSize: 5,
    name: "",
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
