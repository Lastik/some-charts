import {GridOptions, GridOptionsDefaults} from "./grid-options";
import {HeaderOptions, HeaderOptionsDefaults} from "./header-options";
import {LegendOptions, LegendOptionsDefaults} from "./legend-options";
import {RendererOptions, RendererOptionsDefaults} from "./renderer-options";
import {AxesOptions, AxesOptionsDefaults} from "./axes";
import {PlotOptions} from "./plot";
import {NavigationOptions, NavigationOptionsDefaults} from "./navigation";
import {cloneDeep} from "lodash-es";

export interface ChartOptions {

  /**
   * Chart navigation options.
   */
  navigation?: NavigationOptions;
  /**
   *  Chart axes options
   */
  axes?: AxesOptions;
  /**
   *  Chart grid options
   */
  grid?: GridOptions;
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
  plots?: Array<PlotOptions>;
  /**
   *  Chart renderer options
   */
  renderer?: RendererOptions
}


export class ChartOptionsDefaults
{
  public static readonly Instance:  ChartOptions = {
    navigation: cloneDeep(NavigationOptionsDefaults.Instance),
    renderer: cloneDeep(RendererOptionsDefaults.Instance),
    axes: cloneDeep(AxesOptionsDefaults.Instance),
    grid: cloneDeep(GridOptionsDefaults.Instance),
    legend: cloneDeep(LegendOptionsDefaults.Instance),
    plots: []
  }
}
