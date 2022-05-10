import {Renderer} from "./renderer";

/**
 * Base class for all items, rendered by a renderer.
 */
export abstract class RenderableItem {

  private renderer?: Renderer;

  protected constructor() {
    this.renderer = undefined;
  }

  /**
   * Attaches item the to renderer.
   * @param {Renderer} renderer - Renderer to use for item rendering.
   */
  attach(renderer: Renderer) {
    this.renderer = renderer;
  }

  /**
   * Detaches item the to renderer.
   */
  detach() {
    this.renderer = undefined;
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
   * Returns renderer, this item is attached to.
   * @returns Renderer
   */
  getRenderer(): Renderer | undefined {
    return this.renderer;
  }
}
