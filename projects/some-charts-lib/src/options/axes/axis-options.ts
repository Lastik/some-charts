/**
 * Chart renderer options
 */
import {FontInPx} from "../../font";
import {AxisTypes} from "../../chart/axis/axis-types";
import {Skin} from "../skin";
import {cloneDeep} from "lodash-es";

export interface AxisOptions extends AxisMajorOptions, AxisSkin { }

export interface AxisMajorOptions {
  /**
   * Axis type
   */
  axisType: AxisTypes;
}

export interface AxisSkin {
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

export class AxisOptionsDefaults {
  public static readonly Skins: { [key: string]: AxisSkin } = {
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

  public static readonly MajorOptions: AxisMajorOptions = {
    axisType: AxisTypes.NumericAxis
  }

  public static applyTo<AxisOptionsType extends AxisOptions>(options: AxisOptionsType, skin: Skin = Skin.Default, majorOptions: AxisMajorOptions = AxisOptionsDefaults.MajorOptions): AxisOptionsType {
    return {...cloneDeep(majorOptions), ...cloneDeep(this.Skins[skin]), ...cloneDeep(options)};
  }
}
