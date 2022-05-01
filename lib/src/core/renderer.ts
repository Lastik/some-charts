import {Size} from "../model/size";
import {RenderableItem} from "./renderable-item";
import {EventUtils} from "../services/event-utils";
import {ACEventTarget} from "../model/events/a-c-event-target";
import {UagentUtils} from "../services/uagent-utils";
import {RendererOptions, RendererOptionsDefaults} from "../options/renderer-options";
import {ChartOptions, ChartOptionsDefaults} from "../options/chart-options";
import {JqueryHelper} from "../services/jquery-helper";

export class Renderer {

  private stage: Kinetic.IStage;
  private handle: number;
  private objects: RenderableItem[];

  private _onContainerMouseUpListener = null;

  private lastRenderTime: Date | null = null;

  private static readonly IdleTimeout = 300;

  private idleFired: boolean = false;

  protected eventTarget: ACEventTarget;

  private size: Size;

  renderFunc = null;

  private container: JQuery<HTMLElement>;

  private backDiv: JQuery<HTMLElement>;
  private stageDiv: JQuery<HTMLElement>;

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

    let borderStyle = options.rendererOptions.borderStyle ?? RendererOptionsDefaults.Instance.borderStyle
    let backgroundStyle = options.rendererOptions.backgroundColor ?? RendererOptionsDefaults.Instance.backgroundColor;
    let cursor = options.rendererCursor ?? ChartOptionsDefaults.Instance.rendererCursor;

    backDiv.css('background-color', backgroundStyle).css('border', borderStyle).css('position', 'absolute').css('width', size.width).css('height', size.height);

    container.append(backDiv);

    let backDivOuterWidth = backDiv.outerWidth() ?? size.width;
    let backDivOuterHeight = backDiv.outerHeight() ?? size.height;

    let offsetLeft = (size.width - backDivOuterWidth) / 2;
    let offsetTop = (size.height - backDivOuterHeight) / 2;

    backDiv.css('margin-left', offsetLeft).css('margin-top', offsetTop);

    container.on('mouseup', Renderer.createContainerMouseUpListener(this));

    if (cursor != undefined) {
      $(container).css('cursor', cursor);
    }

    this.stageDiv = $(container).clone().css('position', 'absolute').css('width', size.width).css('height', size.height);

    JqueryHelper.setUniqueID(this.stageDiv);
    container.append(this.stageDiv);

    if (!enableNavigation) {
      let overlayDiv = $('<div></div>').css('position', 'absolute').css('width', size.width).css('height', size.height).css('background-color', 'transparent');
      container.append(overlayDiv);
    }

    this.stage = new Kinetic.Stage({
      container: this.stageDiv.attr('id')!,
      width: size.width,
      height: size.height
    });

    this.backDiv = backDiv;

    var self = this;

    this._renderFunc = function () {
      render(self);
    }

    this.handle = Renderer.requestAnimFrame(this._renderFunc);

    this.objects = [];
  }

  protected static createContainerMouseUpListener(self: Renderer) {
    return (e: JQuery.MouseUpEvent) => {
      e.preventDefault();
      if (UagentUtils.isIphone || UagentUtils.isIpad || UagentUtils.isIpod || UagentUtils.isAndroid) {
        EventUtils.redirectMouseEventToElement(e, self.stageDiv[0], false);
      }
      self.eventTarget.fireEventOfType(EventType.MouseClicked);
    };
  };


  dispose() {
    /// <summary>Disposes renderer.</summary>
    this._isDisposed = true;
    if (this.stage != null) {
      var stages = Kinetic.GlobalObject.stages;
      stages.splice(stages.indexOf(this.stage), 1);
    }

    this._container.removeEventListener("mouseup", this._onContainerMouseUpListener, false);
  }

  getStage() {
    /// <summary>Returns renderer's stage instance.</summary>
    /// <returns type="Kinetic.Stage" />
    return this.stage;
  }

  add(object) {
    /// <summary>Adds specified renderable item to renderer.</summary>
    /// <param name="object" type="RenderableItem">Item to add.</param>
    this.objects.push(object);
    object.attach(this);
  }

  getSize() {
    /// <summary>Returns renderer size.</summary>
    /// <returns type="Size" />
    return this._size;
  }

  setSize(newSize) {
    /// <summary>Sets size of renderer.</summary>
    /// <param name="newSize" type="Size">New size of renderer.</param>
    this._size = newSize;
    this.stage.setSize(newSize.width, newSize.height);
    //this._stage.setSizeWithoutRerendering(newSize.width, newSize.height);
    $(this._backDiv).css('width', newSize.width).css('height', newSize.height);
  }

  getAvailableSize(margin) {
    /// <summary>Returns available size on plotter for element with specified margin.</summary>
    /// <param name="margin" type="Number">Element margin.</param>
    /// <returns type="Size" />
    return new Size(this._size.width - 2 * margin, this._size.height - 2 * margin);
  }

  remove(object) {
    var ind = this.objects.indexOf(object);
    this.objects.splice(ind, 1);

    object.detach(this);

    var dependantLayers = object.getDependantLayers();

    for (var i = 0; i < dependantLayers.length; i++) {
      var layer = dependantLayers[i];
      this.stage.getLayer(layer).draw();
    }
  }

  getContainer() {
    /// <summary>Returns element's parent container.</summary>
    /// <returns type="Element" />
    return this.stage.getContainer();
  }

  createLayer(layerName) {
    /// <summary>Creates layer on renderer with specified name.</summary>
    /// <param name="layerName" type="String">Name of layer.</param>
    var stage = this.stage;
    var layer = new Kinetic.Layer();
    layer.name = layerName;
    stage.add(layer);
  }

  createLayers(layersNames) {
    /// <summary>Creates layers on renderer with specified names.</summary>
    /// <param name="layersNames" type="Array">Array of layers names.</param>
    for (var i = 0; i < layersNames.length; i++) {
      this.createLayer(layersNames[i]);

    }
  }

  forceRender() {
    /// <summary>Forses renderer to render. Must be called only in special cases.</summary>
    Renderer.render(this);
  }

  protected static requestAnimFrame: (callback: FrameRequestCallback) => number = (function () {
    return window.requestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();

  static render(renderer: Renderer) {
    //Determine layers, which are dirty.
    let dirtyLayersNames: Array<string> = [];
    for (let obj of renderer.objects) {
      if (obj.hasDirtyLayers && obj.hasDirtyLayers()) {
        let objectDirtyLayers = obj.getDirtyLayers();
        dirtyLayersNames = dirtyLayersNames.concat(objectDirtyLayers);
      }
    }
    //Render each dirty layer.
    for (let layerName of dirtyLayersNames) {
      renderer.stage.find(layerName).draw();
    }

    if (dirtyLayersNames.length > 0) {
      for (let obj of renderer.objects) {
        obj.markDirty();
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
      Renderer.requestAnimFrame(renderer.renderFunc);
    }
  }
}
