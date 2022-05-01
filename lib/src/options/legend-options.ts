import {HeaderOptions} from "./header-options";

/**
* Chart legend options
*/
export interface LegendOptions {
  /**
   * Offset of chart legend from right border.
   */
  offsetRight: number;
  /**
   * Offset of chart legend from top border.
   */
  offsetTop: number;
  /**
   * Legend opacity.
   */
  opacity: number;
  /**
   * Legend font size.
   */
  fontSize: number;
  /**
   * Legend rectangle size.
   */
  rectangleSize: number;
}

export class LegendOptionsDefaults
{
  private static _instance: LegendOptions = {
    offsetRight: 27,
    offsetTop: 50,
    opacity: 0.6,
    fontSize: 12,
    rectangleSize: 13
  }

  public static get Instance()
  {
    return this._instance;
  }
}
