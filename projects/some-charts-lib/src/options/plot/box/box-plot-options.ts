import {PlotOptions} from "../plot-options";
import {PlotKind} from "../plot-kind";
import {Palette} from "../../../chart/plots";
import {MetricOptions} from "../metric-options";
import {Skin} from "../../skin";
import {cloneDeep} from "lodash-es";
import {AnimationOptions} from "../../common";
import {MajorOptions, OptionsDefaults, SkinOptions} from "../../options-defaults";
import {Color} from "../../../color";
import * as ColorObj from "color";

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
      stroke: new ColorObj(this.defaultSkinConsts.foregroundColor).darken(1.5).hex() as Color,
    },
    [Skin.Dark]: {
      lineWidth: 2,
      stroke: this.darkSkinConsts.foregroundColor
    }
  }

  protected readonly majorOptions: BoxPlotMajorOptions = {
    kind: PlotKind.Box,
    metric: {
      id: "",
      caption: "",
      color: '#CF2734'
    },
    animate: AnimationOptions.animate,
    animationDuration: AnimationOptions.animationDuration
  }

  public static readonly Instance = new BoxPlotOptionsDefaults();
}
