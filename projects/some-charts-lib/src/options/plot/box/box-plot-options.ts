import {PlotOptions} from "../plot-options";
import {PlotKind} from "../plot-kind";
import * as Color from "color";
import {Palette} from "../../../chart/plots";
import {MetricOptions} from "../metric-options";
import {Skin} from "../../skin";
import {cloneDeep} from "lodash-es";
import {CommonOptionsValues} from "../../common";

/**
 * Bars plot options
 */
export interface BoxPlotOptions extends BoxPlotMajorOptions, BoxPlotSkin { }


export interface BoxPlotMajorOptions extends PlotOptions{
  /*
    * Marker plot metric with it's color.
    * */
  metric: MetricOptions<Color | Palette>;
}

export interface BoxPlotSkin {
  boxWidth?: number;

  whiskersWidth?: number

  lineWidth?: number;

  stroke?: Color;
}

export class BoxPlotOptionsDefaults
{
  public static readonly Skins: { [key: string]: BoxPlotSkin } = {
    [Skin.Default]: {
      lineWidth: 2,
      stroke: new Color('white')
    }
  }

  public static readonly MajorOptions: BoxPlotMajorOptions = {
    kind: PlotKind.Box,
    metric: {
      id: "",
      caption: "",
      color: new Color('#CF2734')
    },
    animate: CommonOptionsValues.Animate,
    animationDuration: CommonOptionsValues.AnimationDuration
  }

  public static applyTo<BoxPlotOptionsType extends BoxPlotOptions>(options: BoxPlotOptionsType,
                                                                     skin: Skin = Skin.Default,
                                                                     majorOptions: BoxPlotMajorOptions = BoxPlotOptionsDefaults.MajorOptions): BoxPlotOptionsType {
    return {...cloneDeep(majorOptions), ...cloneDeep(this.Skins[skin]), ...cloneDeep(options)};
  }
}
