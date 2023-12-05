import {TextOptions} from "../common";
import {FontUnits} from "../../font";
import {HorizontalAlignment} from "../../alignment";
import {MajorOptions, OptionsDefaults, SkinOptions} from "../options-defaults";
import {Skin} from "../skin";

/**
 * Label options
 */
export interface LabelSkinOptions extends TextOptions, SkinOptions {
  /**
   * Label vertical padding.
   */
  verticalPadding?: number;
  /**
   * Label text alignment.
   */
  textAlignment?: HorizontalAlignment
}

export interface LabelMajorOptions extends MajorOptions{
  /**
   * Label text
   */
  text: string;
}

export interface LabelOptions extends LabelSkinOptions, LabelMajorOptions {}

export class LabelOptionsDefaults<LabelOptionsType extends LabelOptions>
  extends OptionsDefaults<LabelSkinOptions, LabelMajorOptions, LabelOptionsType>
{
  protected constructor() {
    super();
  }

  majorOptions: LabelMajorOptions = {
    text: ''
  } as LabelMajorOptions;

  protected readonly skins: { [key: string]: LabelSkinOptions } = {
    [Skin.Default]: {
      font: {
        size: 16,
        units: FontUnits.Points,
        family: this.defaultSkinConsts.fontFamily
      },
      foregroundColor: this.defaultSkinConsts.foregroundColor,
      verticalPadding: 6,
      textAlignment: HorizontalAlignment.Center
    } as LabelSkinOptions,
    [Skin.Dark]: {
      foregroundColor: this.darkSkinConsts.foregroundColor
    } as LabelSkinOptions
  }

  public static readonly Instance = new LabelOptionsDefaults();
}
