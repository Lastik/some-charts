import {PlotOptions, PlotOptionsClass} from "../../../options";
import {DataTransformation, NumericDataRect} from "../../../geometry";
import {
  DataSet,
  DataSetChange,
  DataSetChange1D,
  DataSetChange2D, DimensionValue,
} from "../../../data";

import {PlotDrawableElement} from "./plot-drawable-element";
import {pullAt} from "lodash-es";
import {AnimationEventType} from "../event";
import {Plot} from "../plot";

export abstract class ElementwisePlot<
  PlotOptionsType extends PlotOptions,
  PlotOptionsClassType extends PlotOptionsClass,
  TItemType,
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined>
  extends Plot<PlotOptionsType, PlotOptionsClassType, TItemType, XDimensionType, YDimensionType> {

  protected plotElements!: PlotDrawableElement[];

  protected constructor(
    dataSet: DataSet<TItemType, XDimensionType, YDimensionType>,
    dataTransformation: DataTransformation,
    plotOptions: PlotOptionsType) {
    super(dataSet, dataTransformation, plotOptions);
  }

  protected override init(plotOptions: PlotOptionsClassType) {
    super.init(plotOptions);
    this.plotElements = [];
  }

  protected rebuildShapesFromDataSet(dataSetChange: DataSetChange<XDimensionType, YDimensionType>): void {
    let updateResult = this.updatePlotElements(dataSetChange);

    for (let plotElt of updateResult.deleted) {
      plotElt.dispose();
      plotElt.rootDrawable.remove();
    }

    pullAt(this.plotElements, updateResult.deletedIndexes);

    for (let plotElt of updateResult.added) {
      this.shapesGroup.add(plotElt.rootDrawable);
      plotElt.eventTarget.addListener(AnimationEventType.Tick, this);
    }
  }

  private updatePlotElements(dataSetChange: DataSetChange<XDimensionType, YDimensionType>): PlotElementsUpdate {
    let is2D = dataSetChange.is2D;

    let deleted: Array<PlotDrawableElement> = [];
    let added: Array<PlotDrawableElement> = [];
    let deletedIndexes: Array<number> = [];

    if (is2D) {

      let dataSetChange2D = dataSetChange as DataSetChange2D<XDimensionType, YDimensionType>;

      for (let i = 0; i < this.plotElements.length; i++) {
        let plotElt = this.plotElements[i];
        if (dataSetChange2D.isDeleted(plotElt.dataPoint.actualValue.x, plotElt.dataPoint.actualValue.y)) {
          deleted.push(plotElt);
          deletedIndexes.push(i);
        } else if (dataSetChange2D.isUpdated(plotElt.dataPoint.actualValue.x, plotElt.dataPoint.actualValue.y)) {
          let xy = dataSetChange2D.getUpdated(plotElt.dataPoint.actualValue.x, plotElt.dataPoint.actualValue.y)!;
          this.update2DPlotElement(plotElt, xy[0], xy[1]);
        }
      }

      for (let tuple of dataSetChange2D.added) {
        let plotElt = this.add2DPlotElement(tuple[0], tuple[1]);
        if (plotElt) {
          this.plotElements.push(...plotElt);
          added.push(...plotElt);
        }
      }
    } else {

      let dataSetChange1D = dataSetChange as DataSetChange1D<XDimensionType>;

      for (let i = 0; i < this.plotElements.length; i++) {
        let plotElt = this.plotElements[i];
        if (dataSetChange1D.isDeleted(plotElt.dataPoint.actualValue.x)) {
          deleted.push(plotElt);
          deletedIndexes.push(i);
        } else if (dataSetChange1D.isUpdated(plotElt.dataPoint.actualValue.x)) {
          this.update1DPlotElement(plotElt, dataSetChange1D.getUpdated(plotElt.dataPoint.actualValue.x)!);
        }
      }

      for (let value of dataSetChange1D.added) {
        let plotElt = this.add1DPlotElement(value);
        if (plotElt) {
          this.plotElements.push(...plotElt);
          added.push(...plotElt);
        }
      }
    }

    return {deleted: deleted, deletedIndexes: deletedIndexes, added: added};
  }

  protected abstract add1DPlotElement(xDimVal: DimensionValue<XDimensionType>): PlotDrawableElement[];

  protected abstract update1DPlotElement(plotElt: PlotDrawableElement,
                                         xDimVal: DimensionValue<XDimensionType>): void;

  protected abstract add2DPlotElement(xDimVal: DimensionValue<XDimensionType>,
                                      yDimVal: DimensionValue<Exclude<YDimensionType, undefined>>): PlotDrawableElement[];

  protected abstract update2DPlotElement(plotElt: PlotDrawableElement,
                                         xDimVal: DimensionValue<XDimensionType>,
                                         yDimVal: DimensionValue<Exclude<YDimensionType, undefined>>): void;

  protected updateShapesVisibleAndScreen(dataTransformation: DataTransformation, visible: NumericDataRect, screen: NumericDataRect): void {
    for (let plotElement of this.plotElements) {
      plotElement.updateShapes(dataTransformation, visible, screen);
    }
  }

  /**
   * Calculates bounding rectangle of this plot.
   * */
  getBoundingRectangle(): NumericDataRect | undefined {
    return this.plotElements.map(plot => plot.getBoundingRectangle()).reduce((l, r) => l.merge(r));
  }
}

interface PlotElementsUpdate {
  deleted: Array<PlotDrawableElement>;
  added: Array<PlotDrawableElement>;
  deletedIndexes: Array<number>;
}
