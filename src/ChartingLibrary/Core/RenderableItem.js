/// <reference path="renderer.js" />

(function (window) {

    var RenderableItem = function () {
        /// <summary>Creates base class for all items, rendered by renderer.</summary>
    }

    var p = RenderableItem.prototype;

    p._renderer = null;

    p.attach = function (renderer) {
        /// <summary>Attaches item to renderer.</summary>
        /// <param name="renderer" type="Renderer">Renderer to attach to.</param>
        this._renderer = renderer;
    }

    p.detach = function (renderer) {
        /// <summary>Detaches item from renderer.</summary>
        /// <param name="renderer" type="Renderer">Renderer to detach from.</param>
        this._renderer = null;
    }

    p.hasDirtyLayers = function () {
        /// <summary>Returns true, if this item has layers, which must be redrawn. Otherwise, returns false.</summary>
        /// <returns type="Boolean" />
        throw "Not implemented";
    }

    p.getDirtyLayers = function () {
        /// <summary>Returns collection of layers, which must be redrawn for specified renderable item.</summary>
        /// <returns type="Array" />
        throw "Not implemented";
    }

    p.getDependantLayers = function () {
        /// <summary>Returns collection of dependant layers. More presisely, all layers, to which this RenderableItem is drawn.</summary>
        /// <returns type="Array" />
        throw "Not implemented";
    }

    p.updateIsDirty = function () {
        /// <summary>This method must be called by renderer, when dirty layers of specified components are redrawn.</summary>
        throw "Not implemented";
    }

    p.getRenderer = function () {
        /// <summary>Returns renderer, this item is attached to.</summary>
        /// <returns type="Renderer" />
        return this._renderer;
    }

    window.RenderableItem = RenderableItem;
}(window));