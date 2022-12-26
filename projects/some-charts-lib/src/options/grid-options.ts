import {OptionsDefaults, SkinOptions} from "./options-defaults";
import {Skin} from "./skin";
import {ConstantsDefaults} from "./skins";
import {keys} from "lodash-es";

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
      foregroundColor: this.constantsDefaults.bySkin[Skin.Default].gridColor,
      backgroundColor: this.constantsDefaults.bySkin[Skin.Default].backgroundColor
    },
    [Skin.Light]: {
      foregroundColor: this.constantsDefaults.bySkin[Skin.Light].gridColor,
      backgroundColor: this.constantsDefaults.bySkin[Skin.Light].backgroundColor
    },
  }

  public static readonly Instance = new GridOptionsDefaults();
}
