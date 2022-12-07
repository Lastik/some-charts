import {OptionsDefaults, SkinOptions} from "./options-defaults";
import {Skin} from "./skin";


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

  public readonly skins: { [key: string]: GridOptions } = {
    [Skin.Default]: {
      foregroundColor: 'white',
      backgroundColor: '#303030'
    }
  }

  public static readonly Instance = new GridOptionsDefaults();
}
