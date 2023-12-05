import {PlotOptions} from "../plot-options";
import {PlotKind} from "../plot-kind";
import {MetricDependantValue, Palette} from "../../../chart/plots";
import {MetricOptions} from "../metric-options";
import {MajorOptions, OptionsDefaults, SkinOptions} from "../../options-defaults";
import {Skin} from "../../skin";
import {AnimationOptions} from "../../common";
import {Color} from "../../../color";

/**
 * Marker plot options
 */
export interface MarkerPlotOptions extends MarkerPlotMajorOptions, MarkerPlotSkin { }


export interface MarkerPlotMajorOptions extends PlotOptions, MajorOptions {
  /*
  * Marker plot metric metadata with its color or palette.
  * */
  metric: MetricOptions<Color | Palette>;
}

export interface MarkerPlotSkin extends SkinOptions {
  /**
   * Marker size in pixels.
   */
  markerSize: number | MetricDependantValue<number>;
}

export class MarkerPlotOptionsDefaults extends OptionsDefaults<MarkerPlotSkin, MarkerPlotMajorOptions, MarkerPlotOptions>
{
  private constructor() {
    super();
  }

  protected readonly skins: { [key: string]: MarkerPlotSkin } = {
    [Skin.Default]: {
      markerSize: 5
    }
  }

  protected readonly majorOptions: MarkerPlotMajorOptions = {
    kind: PlotKind.Marker,
    metric: {
      id: "",
      caption: "",
      color: '#CF2734'
    },
    animate: AnimationOptions.animate,
    animationDuration: AnimationOptions.animationDuration
  }

  public static readonly Instance = new MarkerPlotOptionsDefaults();
}
