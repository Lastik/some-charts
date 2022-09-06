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

  private _isDirty: boolean = true;

  protected set isDirty(value: boolean) {
    this._isDirty = value;
  }

  protected get isDirty(){
    return this._isDirty;
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
   * Returns true, if this item has layers, which must be redrawn. Otherwise, returns false.
   * @returns {boolean}.
   */
  hasDirtyLayers(): boolean {
    return this.isDirty;
  }

  /**
   * Returns array of names of the layers, which must be redrawn for specified renderable item.
   * @returns {Array<string>}.
   */
  getDirtyLayers(): Array<string> {
    if (this.isDirty)
      return this.getDependantLayers();
    else
      return [];
  }

  /**
   * Returns array of names of dependant layers. The layer is called dependant if this item is drawn on it.
   * @returns {Array<string>}.
   */
  abstract getDependantLayers(): Array<string>;

  /**
   * Marks specified renderable item as dirty.
   */
  markDirty() {
    this.isDirty = true;
  }
}
