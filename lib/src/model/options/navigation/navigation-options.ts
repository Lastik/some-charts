export interface NavigationOptions {

  /**
   * Is chart navigation enabled or not.
   */
  isEnabled: boolean;

  /**
   * If top bound while fitting to view must be fixed, pass specific value to this property.
   * */
  fixedTopBound: number | undefined
}


export class NavigationOptionsDefaults
{
  private static _instance: NavigationOptions = {
    isEnabled: true,
    fixedTopBound: undefined,
  }

  public static get Instance()
  {
    return this._instance;
  }
}
