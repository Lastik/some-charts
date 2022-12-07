import {TextOptions} from "../common";
import {FontUnits} from "../../font";
import {HorizontalAlignment} from "../../alignment";
import * as Color from "color";
import {OptionsDefaults, SkinOptions} from "../options-defaults";
import {Skin} from "../skin";

/**
 * Label options
 */
export interface LabelPlotOptions extends TextOptions, SkinOptions {
  /**
   * Label text
   */
  text: string;
  /**
   * Label vertical padding.
   */
  verticalPadding?: number;
  /**
   * Label text alignment.
   */
  textAlignment?: HorizontalAlignment
}

export class LabelOptionsDefaults extends OptionsDefaults<LabelPlotOptions, undefined, LabelPlotOptions>
{
  protected constructor() {
    super();
  }

  majorOptions = undefined;

  public readonly skins: { [key: string]: LabelPlotOptions } = {
    [Skin.Default]: {
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
  }

  public static readonly Instance = new LabelOptionsDefaults();
}
