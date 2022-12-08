import {GridOptions, GridOptionsDefaults} from "./grid-options";
import {HeaderOptions, HeaderOptionsDefaults} from "./header-options";
import {LegendOptions, LegendOptionsDefaults} from "./legend-options";
import {RendererOptions, RendererOptionsDefaults} from "./renderer-options";
import {AxesOptions, AxesOptionsDefaults, AxisOptionsDefaults} from "./axes";
import {PlotOptions, PlotOptionsDefaults} from "./plot";
import {NavigationOptions, NavigationOptionsDefaults} from "./navigation";
import {cloneDeep} from "lodash-es";
import {Skin} from "./skin";

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


export class ChartOptionsDefaults {

  public static applyTo(options: ChartOptions, skin: Skin = Skin.Default): ChartOptions {
    return {
      navigation: cloneDeep(NavigationOptionsDefaults.Instance),
      renderer: RendererOptionsDefaults.Instance.applyTo(options.renderer, skin),
      axes: AxesOptionsDefaults.applyTo(options.axes, skin),
      grid: GridOptionsDefaults.Instance.applyTo(options.grid, skin),
      legend: LegendOptionsDefaults.Instance.applyTo(options.legend, skin),
      plots: options.plots?.map(plotOptions => PlotOptionsDefaults.applyTo(plotOptions, skin)) ?? []
    } as ChartOptions;
  }
}
