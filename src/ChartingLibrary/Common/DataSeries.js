(function (window) {

    var DataSeries = function (data, ordered, name, color) {
        /// <summary>
        /// Creates data series with specified data.
        /// Data series contains data points array,
        // Name and color
        /// </summary>
        /// <param name="data" type="Array">Array with data series data points.</param>
        /// <param name="ordered" type="Boolean">True, if data series data is ordered. Otherwise, must be false.</param>
        /// <param name="name" type="String">Series name.</param>
        /// <param name="color" type="String">Color, used for displaying series.</param>
        this.data = data;
        this.ordered = ordered;
        this.name = name;
        this.color = color;

    }

    var p = DataSeries.prototype;

    p.data = null;
    p.ordered = null;

    p.name = null;
    p.color = null;

    window.DataSeries = DataSeries;

}(window));