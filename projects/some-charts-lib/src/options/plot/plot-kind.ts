export enum PlotKind {
  /**
   * 1D plot, where values are displayed as bars with labels on the plot.
   * See https://en.wikipedia.org/wiki/Bar_chart for more info.
   * */
  Bars = 'Bars',
  /**
   * 1D or 2D plot, where values are displayed as markers on the plot.
   * */
  Marker = 'Marker',
  /**
   * 1D plot, where array of values are displayed as boxes with whiskers.
   * See https://en.wikipedia.org/wiki/Box_plot for more info.
   * */
  Box = 'Box',
  /**
   * 1D plot, for displaying outliers values for box plot from array of values.
   * See https://en.wikipedia.org/wiki/Box_plot and https://en.wikipedia.org/wiki/Outlier for more info.
   * */
  BoxOutliers = 'BoxOutliers',
}
