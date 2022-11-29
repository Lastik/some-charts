import {LabelOptions, LabelOptionsDefaults} from "./plot";
import {cloneDeep} from "lodash-es";

/**
 * Chart header options
 */
export interface HeaderOptions extends LabelOptions {
}

export class HeaderOptionsDefaults
{
  public static readonly Instance: HeaderOptions = cloneDeep(LabelOptionsDefaults.Instance);
}
