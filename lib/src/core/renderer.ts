import {Size, ACEventTarget, EventType} from "../model";
import {RenderableItem} from "./renderable-item";
import {EventUtils, UagentUtils, JqueryHelper} from "../services";
import {ChartOptions, ChartOptionsDefaults, RendererOptionsDefaults} from "../options";
import Konva from "konva";

export class Renderer {

  private readonly stage: Konva.Stage;
  private handle: number;
  private renderableItems: RenderableItem[];

  private readonly containerMouseUpListener: (e: JQuery.MouseUpEvent) => void;

  private lastRenderTime: Date | null = null;

  private static readonly IdleTimeout = 300;

  private idleFired: boolean = false;

  protected eventTarget: ACEventTarget;

  private size: Size;

  private container: JQuery;

  private readonly backgroundElt: JQuery;
  private readonly stageElt: JQuery;

  private isDisposed: boolean = false;


  /**
   * Creates new instance of renderer.
   * @param {string} elementID - ID of HTML element where to create renderer.
   * @param {Size} size - Renderer size
   * @param {ChartOptions} options - chart options
   * @param {boolean} enableNavigation - Optional parameter, which indicates, whether navigation on renderer is enabled. Default value is true.
   */
  constructor(elementID: string, size: Size, options: ChartOptions, enableNavigation: boolean) {
    if (enableNavigation == undefined)
      enableNavigation = true;

    let container = $(elementID);

    if (!container.length) {
      throw new Error(`Element with ${elementID} id not found!`);
    }

    this.container = container;

    this.size = size;

    this.eventTarget = new ACEventTarget();

    let backDiv = $('<div></div>');

    let borderStyle = options.renderer.borderStyle ?? RendererOptionsDefaults.Instance.borderStyle
    let backgroundStyle = options.renderer.backgroundColor ?? RendererOptionsDefaults.Instance.backgroundColor;
    let cursor = options.rendererCursor ?? ChartOptionsDefaults.Instance.rendererCursor;

    backDiv.css('background-color', backgroundStyle)
      .css('border', borderStyle)
      .css('position', 'absolute')
      .css('width', size.width)
      .css('height', size.height);

    container.append(backDiv);

    let backDivOuterWidth = backDiv.outerWidth() ?? size.width;
    let backDivOuterHeight = backDiv.outerHeight() ?? size.height;

    let offsetLeft = (size.width - backDivOuterWidth) / 2;
    let offsetTop = (size.height - backDivOuterHeight) / 2;

    backDiv.css('margin-left', offsetLeft).css('margin-top', offsetTop);

    this.containerMouseUpListener = Renderer.createContainerMouseUpListener(this);
    container.on('mouseup', this.containerMouseUpListener);

    if (cursor != undefined) {
      $(container).css('cursor', cursor);
    }

    this.stageElt = $('<div></div>')
      .css('position', 'absolute')
      .css('width', size.width)
      .css('height', size.height);

    JqueryHelper.setUniqueID(this.stageElt);
    container.append(this.stageElt);

    if (!enableNavigation) {
      let overlayDiv = $('<div></div>')
        .css('position', 'absolute')
        .css('width', size.width)
        .css('height', size.height)
        .css('background-color', 'transparent');
      container.append(overlayDiv);
    }

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

  protected static createContainerMouseUpListener(self: Renderer): (e: JQuery.MouseUpEvent) => void {
    return (e: JQuery.MouseUpEvent) => {
      e.preventDefault();
      if (UagentUtils.isIphone || UagentUtils.isIpad || UagentUtils.isIpod || UagentUtils.isAndroid) {
        EventUtils.redirectMouseEventToElement(e.originalEvent!, self.stageElt[0], false);
      }
      self.eventTarget.fireEventOfType(EventType.MouseClicked);
    };
  };


  /**
   * Disposes the renderer
   */
  dispose() {
    this.isDisposed = true;
    if (this.stage != null) {
      this.stage.destroy();
    }

    this.container.off('mouseup', this.containerMouseUpListener);
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
    //Determine layers, which are dirty.
    let dirtyLayersNames: Array<string> = [];
    for (let item of renderer.renderableItems) {
      if (item.hasDirtyLayers && item.hasDirtyLayers()) {
        let objectDirtyLayers = item.getDirtyLayers();
        dirtyLayersNames = dirtyLayersNames.concat(objectDirtyLayers);
      }
    }
    //Render each dirty layer.
    for (let layerName of dirtyLayersNames) {
      renderer.stage.findOne(layerName).draw();
    }

    if (dirtyLayersNames.length > 0) {
      for (let item of renderer.renderableItems) {
        item.markDirty();
      }
      renderer.lastRenderTime = new Date();
      renderer.idleFired = false;
    } else if (!renderer.idleFired && renderer.lastRenderTime != null) {
      let now = new Date();
      let diff = now.getTime() - renderer.lastRenderTime.getTime();
      if (diff >= Renderer.IdleTimeout) {
        renderer.eventTarget.fireEventOfType(EventType.Idle);
        renderer.idleFired = true;
      }
    }

    if (!renderer.isDisposed) {
      Renderer.requestAnimFrame(() => Renderer.redraw((renderer)));
    }
  }
}
