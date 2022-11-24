import {PlotKind} from "../../plot-kind";
import * as Color from "color";
import {PlotOptions} from "../../plot-options";
import {MetricOptions} from "../../metric-options";

/**
 * Box outliers plot options
 */
export interface BoxOutliersPlotOptions extends PlotOptions {
  /*
  * Marker plot metric with it's color.
  * */
  metric: MetricOptions<Color>;

  /**
   * Marker size.
   */
  markerSize: number;
}

export class BoxOutliersPlotOptionsDefaults
{
  private static _instance: BoxOutliersPlotOptions = {
    metric: {
      id: "",
      caption: "",
      color: new Color('#66AADE')
    },
    markerSize: 5,
    kind: PlotKind.BoxOutliers,
    animate: false,
    animationDuration: 600
  }

  public static get Instance()
  {
    return this._instance;
  }
}
