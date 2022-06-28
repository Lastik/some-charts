import {Size} from "../model";
import {RenderableItem} from "./renderable-item";
import {JqueryHelper} from "../services";
import Konva from "konva";
import {Cursor, IDisposable} from "../common";
import extend from "lodash-es/extend";
import {RendererOptions, RendererOptionsDefaults} from "../options";

export class Renderer implements IDisposable{

  private options: RendererOptions;

  private readonly stage: Konva.Stage;
  private handle: number;
  private renderableItems: RenderableItem[];

  private size: Size;

  private container: JQuery;

  private readonly backgroundElt: JQuery;
  private readonly stageElt: JQuery;

  private isDisposed: boolean = false;

  /**
   * Creates new instance of renderer.
   * @param {string} elementID - ID of HTML element where to create renderer.
   * @param {Size} size - Renderer size
   * @param {RendererOptions} options - renderer options
   * @param {string | undefined} cursor - Cursor style for the renderer.
   */
  constructor(elementID: string, size: Size,
              options: RendererOptions,
              cursor?: string) {

    let container = $(elementID);

    if (!container.length) {
      throw new Error(`Element with ${elementID} id not found!`);
    }

    this.container = container;
    container.addClass('fac-renderer')

    this.size = size;

    let backDiv = $('<div class="fac-renderer__back"></div>');

    this.options = extend(RendererOptionsDefaults.Instance, options);

    let borderStyle = this.options.borderStyle!
    let backgroundStyle = this.options.backgroundColor!

    backDiv.css('background-color', backgroundStyle)
      .css('border', borderStyle)
      .css('width', size.width)
      .css('height', size.height);

    container.append(backDiv);

    let backDivOuterWidth = backDiv.outerWidth() ?? size.width;
    let backDivOuterHeight = backDiv.outerHeight() ?? size.height;

    let offsetLeft = (size.width - backDivOuterWidth) / 2;
    let offsetTop = (size.height - backDivOuterHeight) / 2;

    backDiv.css('margin-left', offsetLeft).css('margin-top', offsetTop);

    this.stageElt = $('<div class="fac-renderer__stage"></div>')
      .css('width', size.width)
      .css('height', size.height);

    JqueryHelper.setUniqueID(this.stageElt);
    container.append(this.stageElt);

    this.stage = new Konva.Stage({
      container: this.stageElt.attr('id')!,
      width: size.width,
      height: size.height
    });

    this.backgroundElt = backDiv;

    let self = this;

    this.handle = Renderer.requestAnimFrame(() => {
      Renderer.redraw(self)
    });

    this.renderableItems = [];
  }

  /**
   * Disposes the renderer
   */
  dispose() {
    this.isDisposed = true;
    if (this.stage != null) {
      this.stage.destroy();
    }
  }

  /**
   * Returns renderer's stage instance.
   * @returns {Konva.Stage}
   */
  getStage() {
    return this.stage;
  }

  /**
   * Adds specified item for rendering.
   * @param {RenderableItem} item - Item to add for rendering.
   */
  add(item: RenderableItem) {
    this.renderableItems.push(item);
    item.attach(this);
  }

  /**
   * Returns renderer's element size.
   * @returns {Size}
   */
  getSize() {
    return this.size;
  }

  /**
   * Sets size of renderer's element
   * @param {Size} newSize - New size of renderer's element
   */
  setSize(newSize: Size) {
    this.size = newSize;
    this.stage.setSize(newSize);
    this.backgroundElt.css('width', newSize.width).css('height', newSize.height);
  }

  /**
   * Returns available size on renderer for element with specified margin.
   * @param {number} margin - Element margin.
   * @returns number
   */
  getAvailableSize(margin: number) {
    return new Size(this.size.width - 2 * margin, this.size.height - 2 * margin);
  }

  /**
   * Removes specified renderable item from renderer.
   * @param {RenderableItem} item - Item to remove.
   */
  remove(item: RenderableItem) {
    var ind = this.renderableItems.indexOf(item);
    this.renderableItems.splice(ind, 1);

    item.detach();

    for (let layerName of item.getDependantLayers()) {
      this.stage.findOne(layerName).draw();
    }
  }

  /**
   * Returns renderer's containing HTML element.
   * @returns {HTMLElement}
   */
  getContainer() {
    return this.stage.container();
  }

  /**
   * Sets renderer's cursor.
   */
  setCursor(cursor: Cursor) {
    $(this.getContainer()).css('cursor', cursor);
  }

  /**
   * Creates layer on renderer with specified name.
   * @param {string} layerName - Name of the layer.
   */
  createLayer(layerName: string) {
    let stage = this.stage;
    let layer = new Konva.Layer({name: layerName});
    stage.add(layer);
  }

  /**
   * Creates multiple layers on renderer with specified names.
   * @param {Array<string>} layersNames - Array of layers names.
   */
  createLayers(layersNames: Array<string>) {
    for (let layerName of layersNames) {
      this.createLayer(layerName);
    }
  }

  /**
   * Destroys layer on renderer with specified name.
   * @param {string} layerName - Name of the layer.
   */
  destroyLayer(layerName: string){
    this.stage.findOne(layerName).destroy();
  }

  /**
   * Destroys multiple layers on renderer with specified names.
   * @param {Array<string>} layersNames - Array of layers names.
   */
  destroyLayers(layersNames: Array<string>) {
    for (let layerName of layersNames) {
      this.destroyLayer(layerName);
    }
  }

  /**
   * Forces renderer to redraw the entire scene.
   */
  forceRedraw() {
    Renderer.redraw(this);
  }

  protected static requestAnimFrame: (callback: FrameRequestCallback) => number = (function () {
    return window.requestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();

  protected static redraw(renderer: Renderer) {
    let dirtyLayersNames: Array<string> = [];
    for (let item of renderer.renderableItems) {
      if (item.hasDirtyLayers && item.hasDirtyLayers()) {
        let objectDirtyLayers = item.getDirtyLayers();
        dirtyLayersNames = dirtyLayersNames.concat(objectDirtyLayers);
      }
    }
    for (let layerName of dirtyLayersNames) {
      renderer.stage.findOne(layerName).draw();
    }

    if (!renderer.isDisposed) {
      Renderer.requestAnimFrame(() => Renderer.redraw((renderer)));
    }
  }
}
