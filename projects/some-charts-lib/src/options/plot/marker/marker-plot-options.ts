import {PlotOptions} from "../plot-options";
import {PlotKind} from "../plot-kind";
import * as Color from "color";
import {MetricDependantValue, Palette} from "../../../chart/plots";
import {MetricOptions} from "../metric-options";

/**
 * Marker plot options
 */
export interface MarkerPlotOptions extends PlotOptions {

  /*
  * Marker plot metric with it's color.
  * */
  metric: MetricOptions<Color | Palette>;

  /**
   * Marker size.
   */
  markerSize: number | MetricDependantValue<number>;
}

export class MarkerPlotOptionsDefaults
{
  public static readonly Instance:  MarkerPlotOptions = {
    metric: {
      id: "",
      caption: "",
      color: new Color('blue')
    },
    markerSize: 5,
    kind: PlotKind.Marker,
    animate: false,
    animationDuration: 600
  }
}
