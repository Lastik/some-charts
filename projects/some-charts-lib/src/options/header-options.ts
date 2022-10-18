import {LabelOptions, LabelOptionsDefaults} from "./plot";
import {cloneDeep} from "lodash-es";

/**
 * Chart header options
 */
export interface HeaderOptions extends LabelOptions {
}

export class HeaderOptionsDefaults
{
  private static _instance: HeaderOptions = cloneDeep(LabelOptionsDefaults.Instance);

  public static get Instance()
  {
    return this._instance;
  }
}
