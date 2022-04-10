(function (window) {

    var Size = function (width, height) {
        /// <summary>Creates size structure with width and height.</summary>
        /// <param name="width" type="Number">Size width.</param>
        /// <param name="height" type="Number">Size height.</param>
        this.width = width;
        this.height = height;
    }

    var p = Size.prototype;

    p.width = 0;
    p.height = 0;

    window.Size = Size;

}(window));