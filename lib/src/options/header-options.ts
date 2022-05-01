import {GridOptions} from "./grid-options";

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
  headerFont: string;
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
    headerFont: '16pt Calibri',
    headerForegroundColor: 'white',
    headerVerticalMargin: 6
  }

  public static get Instance()
  {
    return this._instance;
  }
}
