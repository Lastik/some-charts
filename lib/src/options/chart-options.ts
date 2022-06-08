import {GridOptions, GridOptionsDefaults} from "./grid-options";
import {HeaderOptions, HeaderOptionsDefaults} from "./header-options";
import {LegendOptions, LegendOptionsDefaults} from "./legend-options";
import {PlotOptions, PlotOptionsDefaults} from "./plot-options";
import {RendererOptions, RendererOptionsDefaults} from "./renderer-options";
import {Margin} from "../model";
import {AxesOptions, AxesOptionsDefaults} from "./axes";

export interface ChartOptions {

  /**
   * Is chart navigation enabled or not.
   */
  isNavigationEnabled: boolean;
  /**
   *  Cursor, set for chart.
   */
  rendererCursor: string;

  /**
   *  Chart axes options
   */
  axes: AxesOptions;
  /**
   *  Chart grid options
   */
  grid: GridOptions;
  /**
   *  Chart header options
   */
  header: HeaderOptions;
  /**
   *  Chart legend options
   */
  legend?: LegendOptions;
  /**
   *  Chart plot options
   */
  plotOptions: PlotOptions;
  /**
   *  Chart renderer options
   */
  renderer: RendererOptions
}


export class ChartOptionsDefaults
{
  private static _instance: ChartOptions = {
    isNavigationEnabled: true,
    rendererCursor: "pointer",
    renderer: RendererOptionsDefaults.Instance,
    axes: AxesOptionsDefaults.Instance,
    grid: GridOptionsDefaults.Instance,
    header: HeaderOptionsDefaults.Instance,
    legend: LegendOptionsDefaults.Instance,
    plotOptions: PlotOptionsDefaults.Instance
  }

  public static get Instance()
  {
    return this._instance;
  }
}
