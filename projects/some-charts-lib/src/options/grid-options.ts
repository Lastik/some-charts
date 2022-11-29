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
  public static readonly Instance:  GridOptions = {
    foregroundColor: 'white',
    backgroundColor: '#303030'
  }
}
