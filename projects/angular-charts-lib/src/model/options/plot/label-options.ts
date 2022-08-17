import {TextOptions} from "../common";
import {FontUnits} from "../../font";
import {HorizontalAlignment} from "../../alignment";
import * as Color from "color";

/**
 * Label options
 */
export interface LabelOptions extends TextOptions {
  /**
   * Label text
   */
  text: string;
  /**
   * Label vertical padding.
   */
  verticalPadding: number;
  /**
   * Label text alignment.
   */
  textAlignment: HorizontalAlignment
}

export class LabelOptionsDefaults
{
  private static _instance: LabelOptions = {
    text: '',
    font: {
      size: 16,
      units: FontUnits.Points,
      family: 'Calibri'
    },
    foregroundColor: new Color("white"),
    verticalPadding: 6,
    textAlignment: HorizontalAlignment.Center
  }

  public static get Instance()
  {
    return this._instance;
  }
}
