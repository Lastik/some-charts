import {Renderer} from "./renderer";
import {Chart} from "../plot-base/chart";

/**
 * Base class for all elements, placed on chart.
 */
export abstract class ChartElement {

  private chart?: Chart;

  protected constructor() {
    this.chart = undefined;
  }

  /**
   * Attaches item the to chart.
   * @param {Chart} chart - Chart, where this element is placed.
   */
  attach(chart: Chart) {
    this.chart = chart;
  }

  /**
   * Detaches item from the chart.
   */
  detach() {
    this.chart = undefined;
  }

  /**
   * Returns true, if this item has layers, which must be redrawn. Otherwise, returns false.
   * @returns {boolean}.
   */
  abstract hasDirtyLayers(): boolean

  /**
   * Returns array of names of the layers, which must be redrawn for specified renderable item.
   * @returns {Array<string>}.
   */
  abstract getDirtyLayers(): Array<string>;

  /**
   * Returns array of names of dependant layers. The layer is called dependant if this item is drawn on it.
   * @returns {Array<string>}.
   */
  abstract getDependantLayers(): Array<string>;

  /**
   * Marks specified renderable item as dirty.
   * This method must be called by renderer, when dirty layers of specified components are redrawn.
   */
  abstract markDirty(): void;

  /**
   * Returns chart, where this element is placed.
   * @returns Chart
   */
  getChart(): Chart | undefined {
    return this.chart;
  }

  /**
   * Returns renderer, which renders this chart element.
   * @returns Renderer
   */
  getRenderer(): Renderer | undefined {
    return this.chart?.getRenderer();
  }
}
