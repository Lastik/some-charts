/**
 * Chart renderer options
 */
import {AxisOptions, AxisOptionsDefaults} from "./axis-options";
import {cloneDeep} from "lodash-es";

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
    horizontal: cloneDeep(AxisOptionsDefaults.Instance),
    vertical: cloneDeep(AxisOptionsDefaults.Instance)
  }

  public static get Instance()
  {
    return this._instance;
  }
}
