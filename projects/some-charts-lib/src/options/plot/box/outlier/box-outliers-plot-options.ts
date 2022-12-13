import {PlotKind} from "../../plot-kind";
import * as Color from "color";
import {PlotOptions} from "../../plot-options";
import {MetricOptions} from "../../metric-options";
import {Skin} from "../../../skin";
import {MajorOptions, OptionsDefaults, SkinOptions} from "../../../options-defaults";

/**
 * Box outliers plot options
 */
export interface BoxOutliersPlotOptions extends BoxOutliersMajorOptions, BoxOutliersSkin { }


export interface BoxOutliersMajorOptions extends PlotOptions, MajorOptions {
  /**
   * Metric options.
   * */
  metric: MetricOptions<Color>;
}

export interface BoxOutliersSkin extends SkinOptions {
  /**
   * Marker size.
   */
  markerSize: number;
}

export class BoxOutliersPlotOptionsDefaults extends OptionsDefaults<BoxOutliersSkin, BoxOutliersMajorOptions, BoxOutliersPlotOptions>
{
  private constructor() {
    super();
  }

  protected readonly skins: { [key: string]: BoxOutliersSkin } = {
    [Skin.Default]: {
      markerSize: 5,
    }
  }

  protected readonly majorOptions: BoxOutliersMajorOptions = {
    metric: {
      id: "",
      caption: "",
      color: new Color('#66AADE')
    },
    kind: PlotKind.BoxOutliers,
    animate: false,
    animationDuration: 600
  }

  public static readonly Instance = new BoxOutliersPlotOptionsDefaults();
}
