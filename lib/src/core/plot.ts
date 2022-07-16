import {ChartRenderableItem} from "./chart-renderable-item";
import Konva from "konva";
import {DataSet} from "./data";
import {DataRect} from "../model";

export abstract class Plot<TItemType,
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined> extends ChartRenderableItem {

  private readonly id: number;
  private readonly layerName: string;
  private plotShape: Konva.Shape;

  private static currentPlotID: number = 1;

  private visible: DataRect | undefined;
  private screen: DataRect | undefined;

  protected constructor(dataSet: DataSet<TItemType, XDimensionType, YDimensionType>) {
    super();

    this.id = Plot.currentPlotID++;
    this.layerName = `plot-layer-${this.id}`;
    this.plotShape = new Konva.Shape({
      sceneFunc: this.drawFunc
    });
  }

  protected abstract drawFunc(context: Konva.Context, shape: Konva.Shape): void;

  getDependantLayers(): string[] {
    return [this.layerName];
  }

  /**
  * Sets visible rectangle of plot
   * @param {DataRect} visible - Visible rectangle of plot.
  */
  setVisible(visible: DataRect) {
    this.visible = visible;
    this.markDirty();
  }

  /**
   * Sets screen rectangle of plot
   * @param {DataRect} screen - Screen rectangle of plot.
   */
  setScreen(screen: DataRect) {
    this.screen = screen;
    this.markDirty();
  }

  p.getBoundingRectangle = function () {
    /// <summary>Calculates bounding rectangle of specified plot.</summary>
    /// <returns type="DataRect" />
    var result = null;

    var firstSeries = Enumerable.From(this._dataSeriesCollection).FirstOrDefault(null);
    if (firstSeries == null) {
      //There are no series on the plot.
      //Return null.
      throw 'Unexpected exception';
    }
    else {
      for (var i = 0; i < this._dataSeriesCollection.length; i++) {
        var dataSeries = this._dataSeriesCollection[i];
        var dataSource = dataSeries.data;
        var firstValue = Enumerable.From(dataSource).FirstOrDefault(null);
        if (firstValue == null) {
          continue;
        }
        else if (firstValue instanceof Point) {
          for (var j = 0; j < dataSource.length; j++) {
            var value = dataSource[j];
            if (result == null) {
              result = new DataRect(value.x, value.y, 0, 0);
            }
            else {
              result = result.merge(new DataRect(value.x, value.y, 0, 0));
            }
          }
        }
        else {
          throw 'Not implemented.';
        }
      }
      return result;
    }
  }
}
