import {Size} from "../model/size";
import {RenderableItem} from "./renderable-item";

export class Renderer {

  private _stage: Kinetic.IStage;
  private _handle: number;
  private _objects: RenderableItem[];

  private _onContainerMouseUpListener = null;

  private _lastRenderTime = null;
  private _idleTimeout = 300;
  private _idleFired = null;

  public static requestAnimFrame: (callback: FrameRequestCallback) => number = (function () {
    return window.requestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();

  p.eventTarget = null;

  p._size = null;

  p._renderFunc = null;

  p._backDiv = null;

  p._isDisposed = false;
  p._container = null;


  /**
   * Creates new instance of renderer.
   * @param {string} elementID - ID of HTML element where to create renderer.
   * @param {Size} size - Renderer size
   * @param {boolean} enableNavigation - Optional parameter, which indicates, whether navigation on renderer is enabled. Default value is true.
   */
  constructor(elementID: string, size: Size, enableNavigation: boolean) {
    if (enableNavigation == undefined)
      enableNavigation = true;

    this._size = size;

    this.eventTarget = new EventTarget();

    var backDiv = document.createElement('div');
    var backDivJ = $(backDiv);

    var container = document.getElementById(elementID);

    var borderStyle = container.getAttribute('data-renderer-border');
    var backgroundStyle = container.getAttribute('data-renderer-background');
    var cursor = container.getAttribute(ChartOptionsNames.DataChartRendererCursor);

    $(backDiv).css('background-color', backgroundStyle).css('border', borderStyle).css('position', 'absolute').css('width', size.width).css('height', size.height);

    container.appendChild(backDiv);

    var backDivOuterWidth = backDivJ.outerWidth();
    var backDivOuterHeight = backDivJ.outerHeight();

    var offsetLeft = (size.width - backDivOuterWidth) / 2;
    var offsetTop = (size.height - backDivOuterHeight) / 2;

    backDivJ.css('margin-left', offsetLeft).css('margin-top', offsetTop);

    var eventTarget = this.eventTarget;

    this._onContainerMouseUpListener = function (e) {
      e.preventDefault();
      if (Utilities.isIphone || Utilities.isIpad || Utilities.isIpod || Utilities.isAndroid) {
        Utilities.redirectMouseEventToElement(false, stageDiv[0], 'mouseup');
      }
      eventTarget.fire('mouseClicked');
    };

    container.addEventListener("mouseup", this._onContainerMouseUpListener, false);

    if (cursor != undefined) {
      $(container).css('cursor', cursor);
    }

    this._container = container;

    var stageDiv = $(container).clone().css('position', 'absolute').css('width', size.width).css('height', size.height);
    var stageDivID = Math.random().toString();
    stageDiv.attr('id', stageDivID);
    container.appendChild(stageDiv[0]);

    if (!enableNavigation) {
      var overlayDiv = $('<div></div>').css('position', 'absolute').css('width', size.width).css('height', size.height).css('background-color', 'transparent');
      container.appendChild(overlayDiv[0]);
    }

    this._stage = new Kinetic.Stage(stageDivID, size.width, size.height);

    this._backDiv = backDiv;


    var self = this;

    this._renderFunc = function () {
      render(self);
    }

    this._handle = Renderer.requestAnimFrame(this._renderFunc);

    this._objects = [];
  }


    p.dispose = function () {
      /// <summary>Disposes renderer.</summary>
      this._isDisposed = true;
      if (this._stage != null) {
        var stages = Kinetic.GlobalObject.stages;
        stages.splice(stages.indexOf(this._stage), 1);
      }

      this._container.removeEventListener("mouseup", this._onContainerMouseUpListener, false);
    }

    p.getStage = function () {
      /// <summary>Returns renderer's stage instance.</summary>
      /// <returns type="Kinetic.Stage" />
      return this._stage;
    }

    p.add = function (object) {
      /// <summary>Adds specified renderable item to renderer.</summary>
      /// <param name="object" type="RenderableItem">Item to add.</param>
      this._objects.push(object);
      object.attach(this);
    }

    p.getSize = function () {
      /// <summary>Returns renderer size.</summary>
      /// <returns type="Size" />
      return this._size;
    }

    p.setSize = function (newSize) {
      /// <summary>Sets size of renderer.</summary>
      /// <param name="newSize" type="Size">New size of renderer.</param>
      this._size = newSize;
      this._stage.setSize(newSize.width, newSize.height);
      //this._stage.setSizeWithoutRerendering(newSize.width, newSize.height);
      $(this._backDiv).css('width', newSize.width).css('height', newSize.height);
    }

    p.getAvailableSize = function (margin) {
      /// <summary>Returns available size on plotter for element with specified margin.</summary>
      /// <param name="margin" type="Number">Element margin.</param>
      /// <returns type="Size" />
      return new Size(this._size.width - 2 * margin, this._size.height - 2 * margin);
    }

    p.remove = function (object) {
      var ind = this._objects.indexOf(object);
      this._objects.splice(ind, 1);

      object.detach(this);

      var dependantLayers = object.getDependantLayers();

      for (var i = 0; i < dependantLayers.length; i++) {
        var layer = dependantLayers[i];
        this._stage.getLayer(layer).draw();
      }
    }

    p.getContainer = function () {
      /// <summary>Returns element's parent container.</summary>
      /// <returns type="Element" />
      return this._stage.getContainer();
    }

    p.createLayer = function (layerName) {
      /// <summary>Creates layer on renderer with specified name.</summary>
      /// <param name="layerName" type="String">Name of layer.</param>
      var stage = this._stage;
      var layer = new Kinetic.Layer();
      layer.name = layerName;
      stage.add(layer);
    }

    p.createLayers = function (layersNames) {
      /// <summary>Creates layers on renderer with specified names.</summary>
      /// <param name="layersNames" type="Array">Array of layers names.</param>
      for (var i = 0; i < layersNames.length; i++) {
        this.createLayer(layersNames[i]);

      }
    }

    p.forceRender = function () {
      /// <summary>Forses renderer to render. Must be called only in special cases.</summary>
      window.render(this);
    }

    static render(renderer): Renderer{
      //Determine layers, which are dirty.
      var dirtyLayers = [];
      for (var i = 0; i < renderer._objects.length; i++) {
        var obj = renderer._objects[i];
        if (obj.hasDirtyLayers && obj.hasDirtyLayers()) {
          var objectDirtyLayers = obj.getDirtyLayers();
          dirtyLayers = dirtyLayers.concat(objectDirtyLayers);
        }
      }
      //Render each dirty layer.
      for (var i = 0; i < dirtyLayers.length; i++) {
        var layer = dirtyLayers[i];
        renderer._stage.getLayer(layer).draw();
      }

      if (dirtyLayers.length > 0) {
        for (var i = 0; i < renderer._objects.length; i++) {
          var obj = renderer._objects[i];
          obj.updateIsDirty();
        }
      }

      // If we drew something
      if (dirtyLayers.length != 0) {
        renderer._lastRenderTime = new Date();
        renderer._idleFired = false;
      }
      else if (!renderer._idleFired && renderer._lastRenderTime != null) {
        var now = new Date();
        var diff = now.getTime() - renderer._lastRenderTime.getTime();
        if (diff >= renderer._idleTimeout) {
          renderer.eventTarget.fire('idle');
          renderer._idleFired = true;
        }
      }

      if (!renderer._isDisposed) {
        window.__requestAnimFrame(renderer._renderFunc);
      }
    }

}
