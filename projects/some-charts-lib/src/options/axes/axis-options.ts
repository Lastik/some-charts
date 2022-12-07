/**
 * Chart renderer options
 */
import {FontInPx} from "../../font";
import {AxisTypes} from "../../chart/axis/axis-types";
import {Skin} from "../skin";
import {MajorOptions, OptionsDefaults, SkinOptions} from "../options-defaults";

export interface AxisOptions extends AxisMajorOptions, AxisSkin { }

export interface AxisMajorOptions extends MajorOptions{
  /**
   * Axis type
   */
  axisType: AxisTypes;
}

export interface AxisSkin extends SkinOptions {
  /**
   * Axis foreground color
   */
  foregroundColor?: string;
  /**
   * Axis background color
   */
  backgroundColor?: string;
  /**
   * Axis font
   */
  font?: FontInPx;
  /**
   * Height of axis major ticks
   */
  majorTickHeight?: number;
  /**
   * Height of axis minor ticks
   */
  minorTickHeight?: number;
  /**
   * True, if axis border must be drawn. Otherwise, false.
   */
  drawBorder?: boolean;
}

export class AxisOptionsDefaults extends OptionsDefaults<AxisSkin, AxisMajorOptions, AxisOptions> {

  private constructor() {
    super();
  }

  public readonly skins: { [key: string]: AxisSkin } = {
    [Skin.Default]: {
      foregroundColor: 'white',
      backgroundColor: '#111111',
      font: {
        size: 13,
        family: 'Calibri'
      },
      majorTickHeight: 6,
      minorTickHeight: 3,
      drawBorder: false
    }
  }

  public readonly majorOptions: AxisMajorOptions = {
    axisType: AxisTypes.NumericAxis
  }

  public static readonly Instance = new AxisOptionsDefaults();
}
