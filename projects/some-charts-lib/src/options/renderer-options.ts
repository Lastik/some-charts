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

  public readonly skins: { [key: string]: RendererOptions } = {
    [Skin.Default]: {
      backgroundColor: "#111111",
      borderStyle: "1px solid #000000"
    }
  }

  public static readonly Instance = new RendererOptionsDefaults();
}
