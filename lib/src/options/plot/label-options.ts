import {TextOptions} from "../common";
import {FontUnits} from "../../model";

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
    foregroundColor: 'white',
    verticalPadding: 6
  }

  public static get Instance()
  {
    return this._instance;
  }
}
