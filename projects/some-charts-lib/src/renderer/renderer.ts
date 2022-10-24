import {RenderableItem} from "./renderable-item";
import Konva from "konva";
import merge from "lodash-es/merge";
import {Cursor} from "../cursor";
import {IDisposable} from "../i-disposable";
import {RendererOptions, RendererOptionsDefaults} from "../options";
import {Size} from "../geometry";
import {JqueryHelper} from "../services";
import * as $ from 'jquery'
import {cloneDeep} from "lodash-es";

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
   * @param {string} elementSelector - Selector of HTML element where to create renderer.
   * @param {Size} size - Renderer size
   * @param {RendererOptions} options - renderer options
   */
  constructor(elementSelector: string, size: Size,
              options: RendererOptions) {

    let container = $(elementSelector);

    if (!container.length) {
      throw new Error(`Element with ${elementSelector} id not found!`);
    }

    this.container = container;
    container.addClass('fac-renderer')

    this.size = size;

    let backDiv = $('<div class="fac-renderer__back"></div>');

    this.options = merge(cloneDeep(RendererOptionsDefaults.Instance), options);

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
   * Returns true if the renderer contains this renderable item.
   * @param {RenderableItem} item - renderable item;
   * @returns {boolean}
   */
  contains(item: RenderableItem): boolean {
    return this.renderableItems.map(ri => ri.id).indexOf(item.id) >= 0;
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
    let ind = this.renderableItems.map(ri => ri.id).indexOf(item.id);
    this.renderableItems.splice(ind, 1);

    item.detach();

    for (let layerId of item.getDependantLayers()) {
      this.stage.findOne(`#${layerId}`).draw();
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
   * @param {Konva.LayerConfig} layerConfig - Config of the layer.
   */
  createLayer(layerConfig: Konva.LayerConfig) {
    let stage = this.stage;
    let layer = new Konva.Layer(layerConfig);
    stage.add(layer);
  }

  /**
   * Creates multiple layers on renderer with specified configs.
   * @param {Array<Konva.LayerConfig>} layersConfigs - Array of layers configs.
   */
  createLayers(layersConfigs: Array<Konva.LayerConfig>) {
    for (let layerConfig of layersConfigs) {
      this.createLayer(layerConfig);
    }
  }

  /**
   * Destroys layer on renderer with specified id.
   * @param {string} layerId - Id of the layer.
   */
  destroyLayer(layerId: string){
    this.stage.findOne(`#${layerId}`).destroy();
  }

  /**
   * Destroys multiple layers on renderer with specified ids.
   * @param {Array<string>} layersIds - Array of layers ids.
   */
  destroyLayers(layersIds: Array<string>) {
    for (let layerId of layersIds) {
      this.destroyLayer(layerId);
    }
  }

  /**
   * Returns layer by its id
   * */
  public getLayer(layerId: string) {
    return this.stage.findOne(`#${layerId}`);
  }

  protected static requestAnimFrame: (callback: FrameRequestCallback) => number = (function () {
    return window.requestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();

  protected static redraw(renderer: Renderer) {
    let dirtyLayersIds: Array<string> = [];
    for (let item of renderer.renderableItems) {
      if (item.hasDirtyLayers()) {
        let objectDirtyLayers = item.getDirtyLayers();
        dirtyLayersIds = dirtyLayersIds.concat(objectDirtyLayers);
      }
    }

    dirtyLayersIds = [...new Set(dirtyLayersIds)];

    for (let layerId of dirtyLayersIds) {
      renderer.getLayer(layerId).draw();
    }

    if (!renderer.isDisposed) {
      Renderer.requestAnimFrame(() => Renderer.redraw(renderer));
    }
  }
}
