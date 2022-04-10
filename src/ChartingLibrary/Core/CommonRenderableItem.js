/// <reference path="renderableitem.js" />
(function (window) {

    var CommonRenderableItem = function () {
        /// <summary>Common implementation of RenderableItem class.</summary>
        RenderableItem.call(this);
    }

    CommonRenderableItem.prototype = new RenderableItem();

    var p = CommonRenderableItem.prototype;

    p._isDirty = true;

    p.hasDirtyLayers = function () {
        /// <summary>Returns true, if this item has layers, which must be redrawn. Otherwise, returns false.</summary>
        /// <returns type="Boolean" />
        return this._isDirty;
    }

    p.updateIsDirty = function () {
        /// <summary>This method must be called by renderer, when dirty layers of specified components are redrawn.</summary>
        this._isDirty = false;
    }

    p.getDirtyLayers = function () {
        /// <summary>Returns collection of layers, which must be redrawn for specified renderable item.</summary>
        /// <returns type="Array" />
        if (this._isDirty)
            return this.getDependantLayers();
        else
            return null;
    }

    window.CommonRenderableItem = CommonRenderableItem;
}(window));