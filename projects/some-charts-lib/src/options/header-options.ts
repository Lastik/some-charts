/**
 * Chart header options
 */
import {LabelOptions, LabelOptionsDefaults} from "./plot/label-options";

export interface HeaderOptions extends LabelOptions {
}

export class HeaderOptionsDefaults extends LabelOptionsDefaults<HeaderOptions>
{
  protected constructor() {
    super();
  }

  public static override readonly Instance = new HeaderOptionsDefaults();
}
