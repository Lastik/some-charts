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
   * If top bound while fitting to view must be fixed, pass specific value to this property.
   * */
  fixedTopBound?: number
}


export class NavigationOptionsDefaults
{
  public static readonly Instance:  NavigationOptions = {
    isEnabled: true,
    isFitToViewModeEnabled: false,
    fixedTopBound: undefined,
  }
}
