import {AxisOptions, AxisOptionsDefaults} from "./axis-options";
import {GridOptions, GridOptionsDefaults} from "./grid-options";
import {HeaderOptions, HeaderOptionsDefaults} from "./header-options";
import {LegendOptions, LegendOptionsDefaults} from "./legend-options";
import {PlotOptions, PlotOptionsDefaults} from "./plot-options";
import {RendererOptions, RendererOptionsDefaults} from "./renderer-options";
import {Margin} from "../model/margin";

export interface ChartOptions {

  /**
   * Chart render margin.
   */
  renderMargin: Margin;
  /**
   *  Cursor, set for chart.
   */
  rendererCursor: string;

  /**
   *  Chart axes options
   */
  axesOptions: AxisOptions;
  /**
   *  Chart grid options
   */
  gridOptions: GridOptions;
  /**
   *  Chart header options
   */
  headerOptions: HeaderOptions;
  /**
   *  Chart legend options
   */
  legendOptions: LegendOptions;
  /**
   *  Chart plot options
   */
  plotOptions: PlotOptions;
  /**
   *  Chart renderer options
   */
  rendererOptions: RendererOptions
}


export class ChartOptionsDefaults
{
  private static _instance: ChartOptions = {
    renderMargin: {top: 2, right: 2, bottom: 2, left: 2},
    rendererCursor: "pointer",
    rendererOptions: RendererOptionsDefaults.Instance,
    axesOptions: AxisOptionsDefaults.Instance,
    gridOptions: GridOptionsDefaults.Instance,
    headerOptions: HeaderOptionsDefaults.Instance,
    legendOptions: LegendOptionsDefaults.Instance,
    plotOptions: PlotOptionsDefaults.Instance
  }

  public static get Instance()
  {
    return this._instance;
  }
}
