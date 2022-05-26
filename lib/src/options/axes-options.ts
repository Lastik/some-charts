/**
 * Chart renderer options
 */
import {FontInPx} from "../model/font/font-in-px";
import {AxisOptions, AxisOptionsDefaults} from "./axis-options";


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
  private static _instance: AxesOptions = {
    horizontal: AxisOptionsDefaults.Instance,
    vertical: AxisOptionsDefaults.Instance
  }

  public static get Instance()
  {
    return this._instance;
  }
}
