/**
 * Chart renderer options
 */
import {AxisOptions, AxisOptionsDefaults} from "./axis-options";
import {Skin} from "../skin";
import {MajorOptions, SkinOptions} from "../options-defaults";

export interface AxesOptions extends MajorOptions, SkinOptions {
  /**
   * Horizontal axis options
   */
  horizontal: AxisOptions;
  /**
   * Vertical axis options
   */
  vertical: AxisOptions;
}

export class AxesOptionsDefaults
{
  public static applyTo(options: AxesOptions | undefined, skin: Skin = Skin.Default): AxesOptions {
    return {
      horizontal: AxisOptionsDefaults.Instance.applyTo(options?.horizontal, skin),
      vertical: AxisOptionsDefaults.Instance.applyTo(options?.vertical, skin)
    } as AxesOptions;
  }
}
