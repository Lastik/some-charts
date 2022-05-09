import {ChartElement} from "./chart-element";

/**
 * Common implementation of ChartElement class.
 */
export abstract class CommonChartElement extends ChartElement {

  private isDirty: boolean;

  protected constructor() {
    super();
    this.isDirty = true;
  }

  /**
   * Returns true, if this item has layers, which must be redrawn. Otherwise, returns false.
   * @returns {boolean}.
   */
  override hasDirtyLayers(): boolean {
    return this.isDirty;
  }

  /**
   * Marks specified renderable item as dirty.
   * This method must be called by renderer, when dirty layers of specified components are redrawn.
   */
  override markDirty() {
    this.isDirty = true;
  }

  /**
   * Returns array of names of the layers, which must be redrawn for specified renderable item.
   * @returns {Array<string>}.
   */
  override getDirtyLayers(): Array<string> {
    if (this.isDirty)
      return this.getDependantLayers();
    else
      return [];
  }
}
