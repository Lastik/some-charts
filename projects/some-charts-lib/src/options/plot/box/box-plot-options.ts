import {PlotOptions} from "../plot-options";
import {PlotKind} from "../plot-kind";
import * as Color from "color";
import {Palette} from "../../../chart/plots";
import {MetricOptions} from "../metric-options";
import {Skin} from "../../skin";
import {cloneDeep} from "lodash-es";
import {CommonOptionsValues} from "../../common";
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
  boxWidth?: number;

  whiskersWidth?: number

  lineWidth?: number;

  stroke?: Color;
}

export class BoxPlotOptionsDefaults extends OptionsDefaults<BoxPlotSkin, BoxPlotMajorOptions, BoxPlotOptions>
{
  private constructor() {
    super();
  }

  protected readonly skins: { [key: string]: BoxPlotSkin } = {
    [Skin.Default]: {
      lineWidth: 2,
      stroke: new Color(this.defaultSkinConsts.foregroundColor)
    },
    [Skin.Light]: {
      lineWidth: 1,
      stroke: new Color(this.lightSkinConsts.foregroundColor).darken(1.5),
    }
  }

  protected readonly majorOptions: BoxPlotMajorOptions = {
    kind: PlotKind.Box,
    metric: {
      id: "",
      caption: "",
      color: new Color('#CF2734')
    },
    animate: CommonOptionsValues.Animate,
    animationDuration: CommonOptionsValues.AnimationDuration
  }

  public static readonly Instance = new BoxPlotOptionsDefaults();
}
