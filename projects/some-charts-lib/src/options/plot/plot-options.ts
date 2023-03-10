/**
 * Chart's plot options
 */
import {PlotKind} from "./plot-kind";
import {Skin} from "../skin";
import {BoxOutliersPlotOptions, BoxOutliersPlotOptionsDefaults, BoxPlotOptions, BoxPlotOptionsDefaults} from "./box";
import {MarkerPlotOptions, MarkerPlotOptionsDefaults} from "./marker";
import {BarsPlotOptions, BarsPlotOptionsDefaults} from "./bars";

export interface PlotOptions {
  /**
   * Plot kind. The supported ones are in {@link PlotKind} enum.
   * */
  kind: PlotKind;
  /**
   * Animate plot after data change? The default is {@link CommonOptionsValues.Animate}.
   * */
  animate?: boolean;
  /**
   * Animation duration. The default is {@link CommonOptionsValues.AnimationDuration}.
   * */
  animationDuration?: number;
}

export class PlotOptionsDefaults{

  public static extendWith(options: PlotOptions, skin: Skin = Skin.Default): PlotOptions {

    if(options.kind === PlotKind.BoxOutliers){
      return BoxOutliersPlotOptionsDefaults.Instance.extendWith(options as BoxOutliersPlotOptions, skin);
    }
    else if(options.kind === PlotKind.Box){
      return BoxPlotOptionsDefaults.Instance.extendWith(options as BoxPlotOptions, skin);
    }
    else if(options.kind === PlotKind.Marker){
      return MarkerPlotOptionsDefaults.Instance.extendWith(options as MarkerPlotOptions, skin);
    }
    else if(options.kind === PlotKind.Bars){
      return BarsPlotOptionsDefaults.Instance.extendWith(options as BarsPlotOptions, skin);
    }
    else throw new Error(`Plot of ${options.kind} kind is not supported!`);
  }
}
