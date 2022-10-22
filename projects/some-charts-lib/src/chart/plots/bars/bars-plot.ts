import Konva from "konva";
import merge from "lodash-es/merge";
import {
  BarsPlotOptions,
  BarsPlotOptionsDefaults,
  PlotOptionsClassFactory
} from "../../../options";

import {
  DataTransformation, NumericDataRect,
  NumericPoint,
  Range
} from "../../../geometry";
import {DataSet, DimensionValue} from "../../../data";
import {Plot} from "../plot";
import {BarsColoring} from "./bars-coloring";
import * as Color from "color";
import {FontHelper, MathHelper, TextMeasureUtils} from "../../../services";
import {BarsPlotOptionsClass} from "../../../options/plot/bars";
import {PlotDrawableElement} from "../plot-drawable-element";
import {BarsPlotDrawableElement} from "./bars-plot-drawable-element";
import {cloneDeep} from "lodash-es";

export class BarsPlot<TItemType,
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined>
  extends Plot<BarsPlotOptions, BarsPlotOptionsClass, TItemType, XDimensionType, YDimensionType> {

  private labelsHeight: number | undefined;

  constructor(dataSet: DataSet<TItemType, XDimensionType, YDimensionType>,
              dataTransformation: DataTransformation,
              options: BarsPlotOptions,
              private textMeasureUtils: TextMeasureUtils = TextMeasureUtils.Instance) {
    super(dataSet, dataTransformation, options);

    this.plotOptions = PlotOptionsClassFactory.buildPlotOptionsClass(merge(cloneDeep(BarsPlotOptionsDefaults.Instance), options)) as BarsPlotOptionsClass;
  }

  protected create1DPlotElements(xDimension: DimensionValue<XDimensionType>[]): Array<PlotDrawableElement> {

    let drawableElements: Array<PlotDrawableElement> = [];

    let minY = 0;

    let barAvailableWidthsMap: Map<string, number> = new Map<string, number>();

    let isSingleBar = false;

    for (let metric of this.plotOptions.metrics) {
      let barAvailableWidth = this.calculateBarMaxWidth(metric.name);
      if (barAvailableWidth) {
        barAvailableWidthsMap.set(metric.name, barAvailableWidth);
      }
      let metricPoints = this.getMetricPoints1D(metric.name);

      if (metricPoints?.length === 1) {
        isSingleBar = true;
      }

      if (metricPoints) {
        for (let point of metricPoints) {
          minY = Math.min(minY, point.y);
        }
      }
    }

    for (let metricIdx = this.plotOptions.metrics.length - 1; metricIdx >= 0; metricIdx--) {
      let metric = this.plotOptions.metrics[metricIdx];
      let prevMetric = metricIdx !== 0 ? this.plotOptions.metrics[metricIdx - 1] : undefined;

      let metricPoints = this.getMetricPoints1D(metric.name);
      let metricValues = this.dataSet.getMetricValues(metric.name) as Array<number>;

      if (metricPoints) {

        let prevMetricPts: NumericPoint[] | undefined =
          prevMetric ? this.getMetricPoints1D(prevMetric.name) : undefined;

        let barWidthWithMargin: number | undefined = barAvailableWidthsMap.get(metric.name);

        if (barWidthWithMargin) {

          if (isSingleBar) {
            barWidthWithMargin *= 0.45;
          } else {
            barWidthWithMargin *= 0.7;
          }

          let barsColoring = this.getBarsColoring(metric.color);

          let sampleRect = new Konva.Rect({
            stroke: barsColoring.stroke.toString(),
            strokeWidth: 1,
            fillLinearGradientStartPoint: { x: 0, y: 0 },
            fillLinearGradientEndPoint: { x: 0, y: 50 },
            fillLinearGradientColorStops: [
              0,
              barsColoring.fillGradient.min.toString(),
              0.4,
              barsColoring.fillGradient.max.toString(),
              1,
              barsColoring.fillGradient.max.toString()],
          })

          for (let ptIdx = 0; ptIdx < metricPoints.length; ptIdx++) {

            let rectX: number | undefined;
            let rectY: number | undefined;
            let rectW: number | undefined;
            let rectH: number | undefined;

            let pointLocation = metricPoints[ptIdx];

            if (metricIdx == 0) {
              rectX = MathHelper.optimizeValue(pointLocation.x - barWidthWithMargin / 2);
              rectY = 0;
              rectW = MathHelper.optimizeValue(barWidthWithMargin);
              rectH = MathHelper.optimizeValue(pointLocation.y);
            } else {
              let prevPointLocation = prevMetricPts![ptIdx];

              let barHeight = pointLocation.y;

              let barOriginY: number | undefined;

              if (barHeight < 0) {
                barOriginY = Math.min(prevPointLocation.y + 2, 0);
              } else if (barHeight > 0) {
                barOriginY = Math.max(prevPointLocation.y - 2, 0);
              } else {
                barOriginY = 0;
              }

              rectX = MathHelper.optimizeValue(pointLocation.x - barWidthWithMargin / 2);
              rectY = MathHelper.optimizeValue(barOriginY);
              rectW = MathHelper.optimizeValue(barWidthWithMargin);
              rectH = MathHelper.optimizeValue(pointLocation.y - prevPointLocation.y);
            }

            if (rectH != 0) {

              let group = new Konva.Group({
                x: rectX,
                y: rectY,
                clipFunc: function (ctx) {
                  ctx.rect(rectX, rectY, rectW, rectH);
                }
              });

              let rect = sampleRect.clone({
                x: 0,
                y: 0,
                width: rectW,
                height: rectH,
              });

              group.add(rect);

              let label: Konva.Text | undefined;

              if (this.plotOptions.drawLabelsOnBars) {

                let labelText: string = metricValues[ptIdx].toFixed(this.plotOptions.labelsPrecision);

                let textWidth = this.textMeasureUtils.measureTextSize(this.plotOptions.font, labelText).width;

                let pointLocation = metricPoints[ptIdx];

                let x = barWidthWithMargin / 2 - textWidth / 2;

                this.labelsHeight = this.labelsHeight ??
                  this.textMeasureUtils!.measureFontHeight(this.plotOptions.font);

                let y = this.labelsHeight + 2;

                label = new Konva.Text({
                  x: x,
                  y: y,
                  text: labelText,
                  fill: this.plotOptions.foregroundColor.toString(),
                  stroke: this.plotOptions.foregroundColor.toString(),
                  font: FontHelper.fontToString(this.plotOptions.font)
                })

                group.add(label);
              }

              drawableElements.push(new BarsPlotDrawableElement(pointLocation, group, rect, label));
            }
          }
        }

        prevMetricPts = metricPoints;
      }
    }

    return drawableElements;
  }

  /**
   * Calculates bar available width for metric name.
   * @param {string} metricName - metric name
   * */
  private calculateBarMaxWidth(metricName: string): number | undefined {

    let transformedPts = this.getMetricPoints1D(metricName);

    if(transformedPts){
      if(transformedPts.length >= 2) {

        let minDelta = Number.MAX_VALUE;

        transformedPts.forEach((point, index) => {
          if (index != 0) {
            let prevPoint = transformedPts![index - 1];
            let delta = point.x - prevPoint.x;
            if (delta < minDelta) {
              minDelta = delta;
            }
          }
        });

        return minDelta;
      }
      else if(this.visible && this.screen) {
        let xMin = this.dataTransformation.dataToScreenRegionXY(this.visible.getMinXMinY(), this.visible, this.screen);
        let xMax = this.dataTransformation.dataToScreenRegionXY(this.visible.getMaxXMaxY(), this.visible, this.screen);
        return  xMax.x - xMin.x;
      }
      else return undefined;
    }
    else return undefined;
  }

  private getBarsColoring(fill: Color): BarsColoring {

    let maxColorComponent = Math.max(Math.max(fill.red(), fill.green()), fill.blue());
    let offset = maxColorComponent * 0.3;

    let fromFillColor: Color = Color.rgb(
      Math.min(Math.round(fill.red() + offset), 255),
      Math.min(Math.round(fill.green() + offset), 255),
      Math.min(Math.round(fill.blue() + offset), 255)
    );

    let toFillColor: Color = fill;

    if (!this.plotOptions.useDarkerBorder)
      offset = -maxColorComponent * 0.2;
    else
      offset = -maxColorComponent * 0.78;


    let strokeColor: Color = Color.rgb(
      Math.min(Math.round(fill.red() + offset), 255),
      Math.min(Math.round(fill.green() + offset), 255),
      Math.min(Math.round(fill.blue() + offset), 255)
    );

    return new BarsColoring(new Range<Color>(fromFillColor, toFillColor), strokeColor);
  }

  protected create2DPlotElements(xDimension: DimensionValue<XDimensionType>[], yDimension: DimensionValue<Exclude<YDimensionType, undefined>>[]): Array<PlotDrawableElement> {
    throw new Error(Plot.errors.doesntSupport2DData);
  }

  override getBoundingRectangle() {
    let boundingRect = super.getBoundingRectangle();

    if(boundingRect && this.visible && this.screen && this.plotOptions.metrics.length) {
      let horizontalMargin: number | undefined = undefined;
      for (let metric of this.plotOptions.metrics) {
        let barAvailWidth = this.calculateBarMaxWidth(metric.name);
        if(barAvailWidth) {
          horizontalMargin = Math.min(horizontalMargin ?? Number.MAX_VALUE, barAvailWidth);
        }
      }

      if(horizontalMargin) {

        let visibleHorizontalRange = this.visible.getHorizontalRange();
        let screenHorizontalMargin = this.dataTransformation.screenToDataX(horizontalMargin, visibleHorizontalRange, this.screen.getHorizontalRange().getLength()) - visibleHorizontalRange.min;

        boundingRect = new NumericDataRect(boundingRect.minX - screenHorizontalMargin / 2, boundingRect.maxX + screenHorizontalMargin / 2, boundingRect.minY, boundingRect.maxY);
        boundingRect = boundingRect.merge(new NumericDataRect(boundingRect.minX, boundingRect.maxX, 0, 0));
      }
    }
    return boundingRect;
  }
}
