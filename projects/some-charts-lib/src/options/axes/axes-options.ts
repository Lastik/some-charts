/**
 * Chart renderer options
 */
import {AxisOptions, AxisOptionsDefaults} from "./axis-options";
import {Skin} from "../skin";

export interface AxesOptions {
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
  public static applyTo<AxesOptionsType extends AxesOptions>(options: AxesOptionsType, skin: Skin = Skin.Default): AxesOptionsType {
    return {
      horizontal: AxisOptionsDefaults.applyTo(options.horizontal, skin),
      vertical: AxisOptionsDefaults.applyTo(options.vertical, skin)
    } as AxesOptionsType;
  }
}
