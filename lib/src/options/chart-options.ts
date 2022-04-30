import {AxisOptions} from "./axis-options";
import {GridOptions} from "./grid-options";
import {HeaderOptions} from "./header-options";
import {LegendOptions} from "./legend-options";
import {PlotOptions} from "./plot-options";
import {RendererOptions} from "./renderer-options";

export interface ChartOptions {

  /**
   * Chart render margin.
   */
  renderMargin: number;
  /**
   *  Additional chart margin from right side.
   */
  renderAdditionalMarginRight: number;
  /**
   *  Additional chart margin from bottom side.
   */
  renderAdditionalMarginBottom: number;
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
