import {OptionsDefaults, SkinOptions} from "./options-defaults";
import {Skin} from "./skin";

/**
* Chart legend options
*/
export interface LegendOptions extends SkinOptions {
  /**
   * Legend font size.
   */
  fontSize?: number;
  /**
   * Legend rectangle size.
   */
  rectangleSize?: number;
  /**
   * Legend text color.
   */
  foregroundColor?: string;
}

export class LegendOptionsDefaults extends OptionsDefaults<LegendOptions, undefined, LegendOptions>
{
  protected constructor() {
    super();
  }

  majorOptions = undefined;

  protected readonly skins: { [key: string]: LegendOptions } = {
    [Skin.Default]: {
      foregroundColor: this.defaultSkinConsts.foregroundColor,
      fontSize: 12,
      rectangleSize: 13
    },
    [Skin.Dark]: {
      foregroundColor: this.darkSkinConsts.foregroundColor,
    },
    [Skin.Light]: {
      foregroundColor: this.lightSkinConsts.foregroundColor,
    }
  }

  public static readonly Instance = new LegendOptionsDefaults();
}
