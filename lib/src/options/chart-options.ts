import {GridOptions, GridOptionsDefaults} from "./grid-options";
import {HeaderOptions, HeaderOptionsDefaults} from "./header-options";
import {LegendOptions, LegendOptionsDefaults} from "./legend-options";
import {RendererOptions, RendererOptionsDefaults} from "./renderer-options";
import {AxesOptions, AxesOptionsDefaults} from "./axes";
import {PlotOptions} from "./plot";

export interface ChartOptions {

  /**
   * Is chart navigation enabled or not.
   */
  isNavigationEnabled: boolean;

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
  header?: HeaderOptions;
  /**
   *  Chart legend options
   */
  legend?: LegendOptions;
  /**
   *  Chart's plots options
   */
  plotsOptions: Array<PlotOptions>;
  /**
   *  Chart renderer options
   */
  renderer: RendererOptions
}


export class ChartOptionsDefaults
{
  private static _instance: ChartOptions = {
    isNavigationEnabled: true,
    renderer: RendererOptionsDefaults.Instance,
    axes: AxesOptionsDefaults.Instance,
    grid: GridOptionsDefaults.Instance,
    legend: LegendOptionsDefaults.Instance,
    plotsOptions: []
  }

  public static get Instance()
  {
    return this._instance;
  }
}
