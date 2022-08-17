/**
 * Chart grid options
 */
export interface GridOptions {
  /**
   * Grid foreground color
   */
  foregroundColor: string;
  /**
   * Grid background color
   */
  backgroundColor: string;
}

export class GridOptionsDefaults
{
  private static _instance: GridOptions = {
    foregroundColor: 'white',
    backgroundColor: '#303030'
  }

  public static get Instance()
  {
    return this._instance;
  }
}
