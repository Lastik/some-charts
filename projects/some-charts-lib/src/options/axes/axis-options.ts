/**
 * Chart renderer options
 */
import {FontInPx} from "../../font";
import {AxisTypes} from "../../chart/axis/axis-types";
import {Skin} from "../skin";
import {MajorOptions, OptionsDefaults, SkinOptions} from "../options-defaults";
import {NumericAxisMajorOptions, NumericAxisScaleType} from "./numeric";

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

  protected readonly skins: { [key: string]: AxisSkin } = {
    [Skin.Default]: {
      foregroundColor: this.defaultSkinConsts.foregroundColor,
      backgroundColor: this.defaultSkinConsts.backgroundColor,
      font: {
        size: 13,
        family: this.defaultSkinConsts.fontFamily
      },
      majorTickHeight: 6,
      minorTickHeight: 3,
      drawBorder: false
    },
    [Skin.Dark]: {
      foregroundColor: this.darkSkinConsts.foregroundColor,
      backgroundColor: this.darkSkinConsts.backgroundColor
    }
  }

  protected readonly majorOptions: AxisMajorOptions | NumericAxisMajorOptions = {
    axisType: AxisTypes.NumericAxis,
    scale: {
      scaleType: NumericAxisScaleType.Linear
    }
  }

  public static readonly Instance = new AxisOptionsDefaults();
}
