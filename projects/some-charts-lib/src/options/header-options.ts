import {LabelPlotOptions, LabelOptionsDefaults} from "./plot";
import {cloneDeep} from "lodash-es";
import {OptionsDefaults} from "./options-defaults";

/**
 * Chart header options
 */
export interface HeaderOptions extends LabelPlotOptions {
}

export class HeaderOptionsDefaults extends OptionsDefaults<HeaderOptions, undefined, HeaderOptions>
{
  protected constructor() {
    super();
  }

  majorOptions = undefined;

  public readonly skins: { [key: string]: LabelPlotOptions } = cloneDeep(LabelOptionsDefaults.Instance.skins);

  public static readonly Instance = new HeaderOptionsDefaults();
}
