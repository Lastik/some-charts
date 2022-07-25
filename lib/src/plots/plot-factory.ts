import {singleton} from "tsyringe";
import {PlotOptions} from "../options";
import {Plot} from "../core";
import {PlotKind} from "../options/plot/plot-kind";

@singleton()
export class PlotFactory {
  public createPlot(plotOptions: PlotOptions): Plot {
    if(plotOptions.kind === PlotKind.Bars){
      return new BarsPlot()
    }
  }
}
