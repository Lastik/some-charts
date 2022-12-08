/**
 * Chart's plot options
 */
import {PlotKind} from "./plot-kind";
import {Skin} from "../skin";
import {BoxOutliersPlotOptions, BoxOutliersPlotOptionsDefaults, BoxPlotOptions, BoxPlotOptionsDefaults} from "./box";
import {MarkerPlotOptions, MarkerPlotOptionsDefaults} from "./marker";
import {BarsPlotOptions, BarsPlotOptionsDefaults} from "./bars";

export interface PlotOptions {
  kind: PlotKind;
  animate?: boolean;
  animationDuration?: number;
}

export class PlotOptionsDefaults{

  public static applyTo(options: PlotOptions, skin: Skin = Skin.Default): PlotOptions {

    if(options.kind === PlotKind.BoxOutliers){
      return BoxOutliersPlotOptionsDefaults.Instance.applyTo(options as BoxOutliersPlotOptions, skin);
    }
    else if(options.kind === PlotKind.Box){
      return BoxPlotOptionsDefaults.Instance.applyTo(options as BoxPlotOptions, skin);
    }
    else if(options.kind === PlotKind.Marker){
      return MarkerPlotOptionsDefaults.Instance.applyTo(options as MarkerPlotOptions, skin);
    }
    else if(options.kind === PlotKind.Bars){
      return BarsPlotOptionsDefaults.Instance.applyTo(options as BarsPlotOptions, skin);
    }
    else throw new Error(`Plot of ${options.kind} kind is not supported!`);
  }
}
