/// <reference path="jquery-1.8.2.min.js" />
/// <reference path="kinetic-v3.7.2.js" />
/// <reference path="utilities.js" />

/*
 * short-hand remove event listener to stage (which is essentially
 * the container DOM)
 */
Kinetic.Stage.prototype.off = function (type, func) {
    this.container.removeEventListener(type, func);
};

/*
 * add layer to stage
 */
Kinetic.Stage.prototype.insertBefore = function (layer, beforeLayer) {
    if (layer.name) {
        this.childrenNames[layer.name] = layer;
    }
    layer.canvas.width = this.width;
    layer.canvas.height = this.height;
    this._insertBefore(layer);

    // draw layer and append canvas to container
    layer.draw();

    if (beforeLayer instanceof Kinetic.Layer) {
        var beforeCanvas = beforeLayer.getCanvas();
        this.container.insertBefore(layer.canvas, beforeCanvas);
    }
    else {
        this.container.insertBefore(layer.canvas, beforeLayer[0]);
    }
};

Kinetic.Stage.prototype._insertBefore = function (layer, beforeLayer) {
    if (layer.name) {
        this.childrenNames[layer.name] = layer;
    }
    layer.id = Kinetic.GlobalObject.idCounter++;
    layer.index = this.children.length;
    layer.parent = this;

    if (beforeLayer instanceof Kinetic.Layer) {
        var index = this.children.indexOf(beforeLayer);
        this.children.splice(index, 0, layer);
    }
};

Kinetic.Stage.prototype._uiLayer = null;

/*
* Adds  UI layer to kinetic layers and returns it's instance. If there is already ui layer, returns it.
*/
Kinetic.Stage.prototype.getUIlayer = function () {

    if(this._uiLayer != null)
    {
        return this._uiLayer;
    }

    var layer = $('<div></div>');
    layer.width(this.width);
    layer.height(this.height);

    layer.css('position', 'absolute');

    this.container.appendChild(layer[0]);

    this._uiLayer = layer;

    return layer;
};

//Kinetic.Stage.prototype.setSizeWithoutRerendering = function (width, height) {
//    var layers = this.children;
//    for (var n = 0; n < layers.length; n++) {
//        var layer = layers[n];
//        layer.getCanvas().width = width;
//        layer.getCanvas().height = height;
//    }

//    // set stage dimensions
//    this.width = width;
//    this.height = height;

//    // set buffer layer and backstage layer sizes
//    this.bufferLayer.getCanvas().width = width;
//    this.bufferLayer.getCanvas().height = height;
//    this.backstageLayer.getCanvas().width = width;
//    this.backstageLayer.getCanvas().height = height;
//};


Kinetic.Stage.prototype.__handleEventBase = Kinetic.Stage.prototype._handleEvent;

Kinetic.Stage.prototype._handleEvent = function (evt) {
    var passEventToLayers = true;

    // TODO: add special logic for determining, if mouse event iteracts with some
    // Special object on ui layer.

    if (passEventToLayers)
        this.__handleEventBase(evt);
};

/*
 * get layer by name
 */
Kinetic.Stage.prototype.getLayer = function (name) {
    return this.childrenNames[name];
};