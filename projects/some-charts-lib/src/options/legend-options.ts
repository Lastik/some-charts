import {OptionsDefaults, SkinOptions} from "./options-defaults";
import {Skin} from "./skin";

/**
* Chart legend options
*/
export interface LegendOptions extends SkinOptions {
  /**
   * Legend font size.
   */
  fontSize: number;
  /**
   * Legend rectangle size.
   */
  rectangleSize: number;
}

export class LegendOptionsDefaults extends OptionsDefaults<LegendOptions, undefined, LegendOptions>
{
  protected constructor() {
    super();
  }

  majorOptions = undefined;

  protected readonly skins: { [key: string]: LegendOptions } = {
    [Skin.Default]: {
      fontSize: 12,
      rectangleSize: 13
    }
  }

  public static readonly Instance = new LegendOptionsDefaults();
}
