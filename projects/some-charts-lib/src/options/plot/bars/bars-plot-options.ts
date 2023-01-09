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
   * Array of options for each of stacked bar metrics.
   * */
  metrics: Array<MetricOptions<Color>>;
}

export interface BarsPlotSkin extends SkinOptions{
  /**
   * True, if labels must be drawn on bars. Otherwise, false.
   */
  drawLabelsOnBars?: boolean;
  /**
   * Bars labels precision (amount of digits after zero).
   */
  labelsPrecision?: number;
  /**
   * True, if plot border must be darker than plot background. Otherwise, must be false.
   */
  useDarkerBorder?: boolean;
  /**
   * Font of labels on bars
   */
  font?: Font;
  /**
   * Color of labels bars
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
      font: {
        family: this.defaultSkinConsts.fontFamily,
        size: 13
      },
      useDarkerBorder: true,
      foregroundColor: new Color(this.lightSkinConsts.foregroundColor)
    },
    [Skin.Dark]: {
      useDarkerBorder: false,
      foregroundColor: new Color(this.darkSkinConsts.foregroundColor),
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
