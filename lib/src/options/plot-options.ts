/**
 * Chart plot options
 */
export interface PlotOptions {
  /**
   * True, if plot border must be darker than plot background. Otherwise, must be false.
   */
  useDarkerBorder: boolean;
}

export class PlotOptionsDefaults
{
  private static _instance: PlotOptions = {
    useDarkerBorder: false
  }

  public static get Instance()
  {
    return this._instance;
  }
}
