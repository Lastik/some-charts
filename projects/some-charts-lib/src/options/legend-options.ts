import {OptionsDefaults, SkinOptions} from "./options-defaults";
import {Skin} from "./skin";

/**
* Chart legend options
*/
export interface LegendOptions extends SkinOptions {
  /**
   * Offset of chart legend from right border.
   */
  offsetRight: number;
  /**
   * Offset of chart legend from top border.
   */
  offsetTop: number;
  /**
   * Legend opacity.
   */
  opacity: number;
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
      offsetRight: 27,
      offsetTop: 50,
      opacity: 0.6,
      fontSize: 12,
      rectangleSize: 13
    }
  }

  public static readonly Instance = new LegendOptionsDefaults();
}
