import {PlotOptions} from "../plot-options";
import {PlotKind} from "../plot-kind";
import * as Color from "color";
import {Palette} from "../../../chart/plots";
import {MetricOptions} from "../metric-options";
import {Skin} from "../../skin";
import {cloneDeep} from "lodash-es";
import {AnimationOptions} from "../../common";
import {MajorOptions, OptionsDefaults, SkinOptions} from "../../options-defaults";

/**
 * Box plot options
 * */
export interface BoxPlotOptions extends BoxPlotMajorOptions, BoxPlotSkin { }


export interface BoxPlotMajorOptions extends PlotOptions, MajorOptions {
  /*
    * Box plot metric with its color.
    * */
  metric: MetricOptions<Color | Palette>;
}

export interface BoxPlotSkin extends SkinOptions {
  /**
   * Width of plot lines in pixels.
   **/
  lineWidth?: number;

  /**
   * Color of plot stroke lines.
   **/
  stroke?: Color;
}

export class BoxPlotOptionsDefaults extends OptionsDefaults<BoxPlotSkin, BoxPlotMajorOptions, BoxPlotOptions>
{
  private constructor() {
    super();
  }

  protected readonly skins: { [key: string]: BoxPlotSkin } = {
    [Skin.Default]: {
      lineWidth: 1,
      stroke: new Color(this.defaultSkinConsts.foregroundColor).darken(1.5),
    },
    [Skin.Dark]: {
      lineWidth: 2,
      stroke: new Color(this.darkSkinConsts.foregroundColor)
    }
  }

  protected readonly majorOptions: BoxPlotMajorOptions = {
    kind: PlotKind.Box,
    metric: {
      id: "",
      caption: "",
      color: new Color('#CF2734')
    },
    animate: AnimationOptions.animate,
    animationDuration: AnimationOptions.animationDuration
  }

  public static readonly Instance = new BoxPlotOptionsDefaults();
}
