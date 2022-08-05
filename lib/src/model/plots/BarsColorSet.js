(function (window) {

    var BarsColorSet = function (fill1, fill2, stroke) {
        /// <summary>Represents set of color, used for filling and stroking bars.</summary>
        /// <param name="fill1" type="String">First filling color.</param>
        /// <param name="fill2" type="String">Second filling color.</param>
        /// <param name="stroke" type="String">Stroking color</param>
        this.fill1 = fill1;
        this.fill2 = fill2;
        this.stroke = stroke;
    }

    var p = BarsColorSet.prototype;

    p.fill1 = null;
    p.fill2 = null;
    p.stroke = null;

    window.BarsColorSet = BarsColorSet;

}(window));