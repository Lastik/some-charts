import {Margin} from "../../geometry";

export interface NavigationOptions {

  /**
   * Is chart navigation enabled or not.
   */
  isEnabled?: boolean;

  /**
   * If fit to view mode is initially enabled.
   * */
  isFitToViewModeEnabled?: boolean

  /**
   * This value specifies fixed top bound of chart displayed area.
   * Whenever fit to view is triggered, this value will be used instead of actual top bound from the data.
   * */
  fixedTopBound?: number

  /**
   * Relative padding, in parts.
   * It's being added to actual data bounds whenever fit to view is triggered.
   * */
  relativePadding?: Margin
}


export class NavigationOptionsDefaults
{
  public static readonly Instance:  NavigationOptions = {
    isEnabled: true,
    isFitToViewModeEnabled: false
  }
}
