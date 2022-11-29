import {Font} from "../../../font";
import {PlotOptions} from "../plot-options";
import {PlotKind} from "../plot-kind";
import {MetricOptions} from "../metric-options";
import * as Color from "color";
import {Skin} from "../../skin";
import {cloneDeep} from "lodash-es";
import {CommonOptionsValues} from "../../common";

/**
 * Bars plot options
 */
export interface BarsPlotOptions extends BarsPlotMajorOptions, BarsPlotSkin { }


export interface BarsPlotMajorOptions extends PlotOptions{
  /**
   * Array of metrics options.
   * */
  metrics: Array<MetricOptions<Color>>;
}

export interface BarsPlotSkin {
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

export class BarsPlotOptionsDefaults
{
  public static readonly Skins: { [key: string]: BarsPlotSkin } = {
    [Skin.Default]: {
      drawLabelsOnBars: true,
      labelsPrecision: 2,
      useDarkerBorder: false,
      font: {
        family: 'Calibri',
        size: 13
      },
      foregroundColor: new Color("white"),
    }
  }

  public static readonly MajorOptions: BarsPlotMajorOptions = {
    metrics: [],
    kind: PlotKind.Bars,
    animate: CommonOptionsValues.Animate,
    animationDuration: CommonOptionsValues.AnimationDuration
  }

  public static applyTo<BarsPlotOptionsType extends BarsPlotOptions>(options: BarsPlotOptionsType,
                                                                     skin: Skin = Skin.Default,
                                                                     majorOptions: BarsPlotMajorOptions = BarsPlotOptionsDefaults.MajorOptions): BarsPlotOptionsType {
    return {...cloneDeep(majorOptions), ...cloneDeep(this.Skins[skin]), ...cloneDeep(options)};
  }
}
