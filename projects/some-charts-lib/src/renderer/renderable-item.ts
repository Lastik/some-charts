import {Renderer} from "./renderer";

/**
 * Base class for all items, rendered by a renderer.
 */
export abstract class RenderableItem {

  public readonly id: number;

  private static currentPlotID: number = 1;

  constructor() {
    this.id = RenderableItem.currentPlotID++;
  }

  private renderer?: Renderer = undefined;

  /**
   * Attaches item the to renderer.
   * @param {Renderer} renderer - Renderer to use for item rendering.
   */
  attach(renderer: Renderer) {
    this.renderer = renderer;
    if(!this.renderer.contains(this)) {
      this.renderer.add(this);
    }
  }

  /**
   * Detaches item the to renderer.
   */
  detach() {
    if(this.renderer && this.renderer.contains(this)) {
      this.renderer.remove(this);
    }
    this.renderer = undefined;
  }

  /**
   * Returns array of names of dependant layers. The layer is called dependant if this item is drawn on it.
   * @returns {Array<string>}.
   */
  abstract getDependantLayers(): Array<string>;
}
