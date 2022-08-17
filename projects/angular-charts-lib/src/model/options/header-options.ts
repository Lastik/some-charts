import {LabelOptions, LabelOptionsDefaults} from "./plot";

/**
 * Chart header options
 */
export interface HeaderOptions extends LabelOptions {
}

export class HeaderOptionsDefaults
{
  private static _instance: HeaderOptions = LabelOptionsDefaults.Instance;

  public static get Instance()
  {
    return this._instance;
  }
}
