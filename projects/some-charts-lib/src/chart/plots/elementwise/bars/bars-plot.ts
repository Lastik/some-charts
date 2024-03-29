import merge from "lodash-es/merge";
import {BarsPlotOptions, BarsPlotOptionsDefaults, PlotOptionsClassFactory} from "../../../../options";

import {DataTransformation, NumericDataRect, Range} from "../../../../geometry";
import {DataSet, DimensionValue} from "../../../../data";
import {BarsColoring} from "./bars-coloring";
import {MathHelper} from "../../../../services";
import {BarsPlotOptionsClass} from "../../../../options/plot/bars";
import {PlotDrawableElement} from "../plot-drawable-element";
import {Bar} from "./bar";
import {cloneDeep} from "lodash-es";
import {ElementwisePlot} from "../elementwise-plot";
import {Color} from "../../../../color";
import * as ColorObj from 'color';

export class BarsPlot<TItemType,
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined>
  extends ElementwisePlot<BarsPlotOptions, BarsPlotOptionsClass, TItemType, XDimensionType, YDimensionType> {

  private barMaxWidthMap!: Map<string, number>;
  private colorsByMetricId?: Map<string, BarsColoring>;

  constructor(dataSet: DataSet<TItemType, XDimensionType, YDimensionType>,
              dataTransformation: DataTransformation,
              options: BarsPlotOptions) {
    super(dataSet, dataTransformation, options);
  }

  override buildPlotOptionsClass(plotOptions: BarsPlotOptions): BarsPlotOptionsClass {
    return PlotOptionsClassFactory.buildPlotOptionsClass(merge(cloneDeep(BarsPlotOptionsDefaults.Instance), plotOptions)) as BarsPlotOptionsClass;
  }

  override init(plotOptionsClass: BarsPlotOptionsClass) {
    super.init(plotOptionsClass);
    this.colorsByMetricId = new Map(this.plotOptions.metrics.map(m => [m.id, this.getBarsColoring(m.color)]));
    this.barMaxWidthMap = new Map<string, number>();
  }

  protected add1DPlotElements(xDimVal: DimensionValue<XDimensionType>): PlotDrawableElement[] {
    let drawableElements: PlotDrawableElement[] = [];

    for (let metricIdx = this.plotOptions.metrics.length - 1; metricIdx >= 0; metricIdx--) {
      let metric = this.plotOptions.metrics[metricIdx];
      let prevMetric = metricIdx !== 0 ? this.plotOptions.metrics[metricIdx - 1] : undefined;

      let metricValue = this.dataSet.getSingleMetricValue(metric.id, xDimVal.value);

      if (metricValue) {

        let barsColoring = this.colorsByMetricId?.get(metric.id)!;

        let pointLocation = this.getSingleMetricPoint1D(metric.id, xDimVal);
        let rect = this.getBarRectForMetric(metric.id, prevMetric?.id, xDimVal);

        if (pointLocation && rect) {

          let labelText: string | undefined = this.plotOptions.drawLabelsOnBars ? metricValue.toFixed(this.plotOptions.labelsPrecision) : undefined;

          drawableElements.push(new Bar(
            metric.id,
            pointLocation, rect,
            barsColoring,
            labelText, this.plotOptions.font,
            this.plotOptions.foregroundColor));
        }
      }
    }

    return drawableElements;
  }

  protected add2DPlotElements(xDimVal: DimensionValue<XDimensionType>, yDimVal: DimensionValue<Exclude<YDimensionType, undefined>>): PlotDrawableElement[] {
    throw new Error('Bars plot doesn\'t support 2D rendering');
  }

  protected update1DPlotElement(plotElt: PlotDrawableElement, xDimVal: DimensionValue<XDimensionType>) {
    let metricIdx = this.plotOptions.metrics.findIndex(m => m.id === plotElt.metricId)!;
    let metric = this.plotOptions.metrics[metricIdx];
    let prevMetric = metricIdx !== 0 ? this.plotOptions.metrics[metricIdx - 1] : undefined;

    let metricValue = this.dataSet.getSingleMetricValue(metric.id, xDimVal.value) as number | undefined;

    if (metricValue) {

      let pointLocation = this.getSingleMetricPoint1D(metric.id, xDimVal);
      let rect = this.getBarRectForMetric(metric.id, prevMetric?.id, xDimVal);

      if (pointLocation && rect) {
        let bar = plotElt as Bar;
        bar.dataPoint.setValue(pointLocation,
          this.plotOptions.animate, this.plotOptions.animationDuration);
        bar.relativeBounds.setValue(rect,
          this.plotOptions.animate, this.plotOptions.animationDuration);
        bar.setBarLabelText(metricValue.toFixed(this.plotOptions.labelsPrecision));
      }
    }
  }

  protected update2DPlotElement(plotElt: PlotDrawableElement, xDimVal: DimensionValue<XDimensionType>, yDimVal: DimensionValue<Exclude<YDimensionType, undefined>>): PlotDrawableElement {
    throw new Error('Bars plot doesn\'t support 2D rendering');
  }

  private getBarRectForMetric(metricId: string, prevMetricId: string | undefined, xDimVal: DimensionValue<XDimensionType>): NumericDataRect | undefined {
    let rectX: number | undefined;
    let rectY: number | undefined;
    let rectW: number | undefined;
    let rectH: number | undefined;

    let pointLocation = this.getSingleMetricPoint1D(metricId, xDimVal);
    let barWidth = this.calculateBarMaxWidth(metricId);
    if (pointLocation && barWidth) {
      if (!prevMetricId) {
        rectX = MathHelper.optimizeValue(-barWidth / 2);
        rectY = -MathHelper.optimizeValue(pointLocation.y);
        rectW = MathHelper.optimizeValue(barWidth);
        rectH = MathHelper.optimizeValue(pointLocation.y);
      } else {
        let prevPointLocation = this.getSingleMetricPoint1D(prevMetricId, xDimVal);

        if (prevPointLocation) {
          rectX = MathHelper.optimizeValue(-barWidth / 2);
          rectY = -MathHelper.optimizeValue(pointLocation.y - prevPointLocation.y);
          rectW = MathHelper.optimizeValue(barWidth);
          rectH = MathHelper.optimizeValue(pointLocation.y - prevPointLocation.y);
        }
      }
    }

    if (rectX !== undefined && rectY !== undefined && rectW !== undefined && rectH !== undefined) {
      return NumericDataRect.apply(rectX, rectY, rectW, rectH);
    }
    else return undefined;
  }

  /**
   * Calculates bar available width for metric id.
   * @param {string} metricId - metric id
   * */
  private calculateBarMaxWidth(metricId: string): number | undefined {

    if (this.barMaxWidthMap.has(metricId)) {
      return this.barMaxWidthMap.get(metricId);
    } else {
      let metricPoints = this.getSingleMetricPoints1D(metricId);

      let barWidth: number | undefined;

      if (metricPoints) {
        if (metricPoints.length >= 2) {

          let minDelta = Number.MAX_VALUE;

          metricPoints.forEach((point, index) => {
            if (index != 0) {
              let prevPoint = metricPoints![index - 1];
              let delta = point.x - prevPoint.x;
              if (delta < minDelta) {
                minDelta = delta;
              }
            }
          });

          barWidth = minDelta * 0.7;
        } else {
          barWidth = 1;
        }
      }

      if (barWidth) {
        this.barMaxWidthMap.set(metricId, barWidth);
      }

      return barWidth;
    }
  }

  private getBarsColoring(fill: Color): BarsColoring {

    let fromFillColor = new ColorObj(fill).lighten(0.3).rgb().hex() as Color;

    let toFillColor = fill;
    let strokeColor: Color;

    if (!this.plotOptions.useDarkerBorder)
      strokeColor = new ColorObj(fill).darken(0.1).rgb().hex() as Color;
    else
      strokeColor = new ColorObj(fill).darken(0.3).rgb().hex() as Color;

    return new BarsColoring(new Range<Color>(fromFillColor, toFillColor), strokeColor);
  }

  override clearPreCalculatedDataSetRelatedData(){
    super.clearPreCalculatedDataSetRelatedData();
    this.barMaxWidthMap.clear();
  }
}
