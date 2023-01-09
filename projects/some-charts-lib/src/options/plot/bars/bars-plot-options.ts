import {Font} from "../../../font";
import {PlotOptions} from "../plot-options";
import {PlotKind} from "../plot-kind";
import {MetricOptions} from "../metric-options";
import * as Color from "color";
import {Skin} from "../../skin";
import {CommonOptionsValues} from "../../common";
import {MajorOptions, OptionsDefaults, SkinOptions} from "../../options-defaults";

/**
 * Bars plot options
 * */
export interface BarsPlotOptions extends BarsPlotMajorOptions, BarsPlotSkin { }


export interface BarsPlotMajorOptions extends PlotOptions, MajorOptions{
  /**
   * Array of metrics options.
   * */
  metrics: Array<MetricOptions<Color>>;
}

export interface BarsPlotSkin extends SkinOptions{
  /**
   * True, if labels must be drawn on bars. Otherwise, false.
   */
  drawLabelsOnBars?: boolean;
  /**
   * Bars labels precision.
   */
  labelsPrecision?: number;
  /**
   * True, if plot border must be darker than plot background. Otherwise, must be false.
   */
  useDarkerBorder?: boolean;
  /**
   * Font
   */
  font?: Font;
  /**
   * Foreground color
   */
  foregroundColor?: Color;
}

export class BarsPlotOptionsDefaults extends OptionsDefaults<BarsPlotSkin, BarsPlotMajorOptions, BarsPlotOptions> {
  private constructor() {
    super();
  }

  protected readonly skins: { [key: string]: BarsPlotSkin } = {
    [Skin.Default]: {
      drawLabelsOnBars: true,
      labelsPrecision: 2,
      useDarkerBorder: false,
      font: {
        family: this.defaultSkinConsts.fontFamily,
        size: 13
      },
      foregroundColor: new Color(this.defaultSkinConsts.foregroundColor),
    },
    [Skin.Light]: {
      useDarkerBorder: true,
      foregroundColor: new Color(this.lightSkinConsts.foregroundColor)
    }
  }

  protected readonly majorOptions: BarsPlotMajorOptions = {
    metrics: [],
    kind: PlotKind.Bars,
    animate: CommonOptionsValues.Animate,
    animationDuration: CommonOptionsValues.AnimationDuration
  }

  public static readonly Instance = new BarsPlotOptionsDefaults();
}
