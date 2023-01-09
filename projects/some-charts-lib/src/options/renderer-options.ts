import {OptionsDefaults, SkinOptions} from "./options-defaults";
import {Skin} from "./skin";

/**
* Chart renderer options
*/
export interface RendererOptions extends SkinOptions {
  /**
   * Renderer background color.
   */
  backgroundColor?: string;
  /**
   * Renderer border style.
   */
  borderStyle?: string;
}

export class RendererOptionsDefaults extends OptionsDefaults<RendererOptions, undefined, RendererOptions>
{
  protected constructor() {
    super();
  }

  majorOptions = undefined;

  protected readonly skins: { [key: string]: RendererOptions } = {
    [Skin.Default]: {
      backgroundColor: this.defaultSkinConsts.backgroundColor,
      borderStyle: `none`
    },
    [Skin.Dark]: {
      backgroundColor: this.darkSkinConsts.backgroundColor,
      borderStyle: `1px solid ${this.darkSkinConsts.outerBorderColor}`
    }
  }

  public static readonly Instance = new RendererOptionsDefaults();
}
