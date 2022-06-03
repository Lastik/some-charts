import {FontInUnits, FontUnits} from "../model";

/**
 * Chart header options
 */
export interface HeaderOptions {
  /**
   * Header text
   */
  headerText: string;
  /**
   * Header font
   */
  headerFont: FontInUnits;
  /**
   * Header foreground color
   */
  headerForegroundColor: string;
  /**
   * Header vertical margin.
   */
  headerVerticalMargin: number;
}

export class HeaderOptionsDefaults
{
  private static _instance: HeaderOptions = {
    headerText: '',
    headerFont: {
      size: 16,
      units: FontUnits.Points,
      family: 'Calibri'
    },
    headerForegroundColor: 'white',
    headerVerticalMargin: 6
  }

  public static get Instance()
  {
    return this._instance;
  }
}
