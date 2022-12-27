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
      foregroundColor: this.defaultSkinConsts.foregroundColor,
      backgroundColor: this.defaultSkinConsts.backgroundColor
    },
    [Skin.Light]: {
      foregroundColor: new Color(this.lightSkinConsts.foregroundColor).lighten(1.5).hex(),
      backgroundColor: this.lightSkinConsts.backgroundColor
    },
  }

  public static readonly Instance = new GridOptionsDefaults();
}
