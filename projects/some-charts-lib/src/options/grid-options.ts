import {OptionsDefaults, SkinOptions} from "./options-defaults";
import {Skin} from "./skin";
import * as Color from "color";

/**
 * Chart grid options
 */
export interface GridOptions extends SkinOptions {
  /**
   * Grid foreground color
   */
  foregroundColor: string;
  /**
   * Grid background color
   */
  backgroundColor: string;
}

export class GridOptionsDefaults extends OptionsDefaults<GridOptions, undefined, GridOptions>
{
  protected constructor() {
    super();
  }

  majorOptions = undefined;

  protected readonly skins: { [key: string]: GridOptions } = {
    [Skin.Default]: {
      foregroundColor: new Color(this.defaultSkinConsts.foregroundColor).lighten(1.5).hex(),
      backgroundColor: this.defaultSkinConsts.backgroundColor
    },
    [Skin.Dark]: {
      foregroundColor: this.darkSkinConsts.foregroundColor,
      backgroundColor: this.darkSkinConsts.backgroundColor
    }
  }

  public static readonly Instance = new GridOptionsDefaults();
}
