(function (window) {

    var LegendItem = function (name, color) {
        /// <summaryCreates new item to be displayed on legend.
        /// Item consists of name and color.
        /// </summary>
        /// <param name="name" type="String">Item's name.</param>
        /// <param name="color" type="String">Item's color.</param>
        this.name = name;
        this.color = color;
    }

    var p = LegendItem.prototype;

    p.name = null;
    p.color = null;

    p.value = null;

    window.LegendItem = LegendItem;

}(window));