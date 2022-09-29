import Konva from "konva";
import extend from "lodash-es/extend";
import {
  BarsPlotOptions,
  BarsPlotOptionsDefaults,
  PlotOptionsClassFactory
} from "../../../options";

import {
  DataRect,
  DataTransformation,
  NumericPoint,
  Range
} from "../../../geometry";
import {DataSet, DimensionValue} from "../../../data";
import {Plot} from "../plot";
import {BarsColoring} from "./bars-coloring";
import * as Color from "color";
import {MathHelper, TextMeasureUtils} from "../../../services";
import {BarsPlotOptionsClass} from "../../../options/plot/bars";
import {PlotDrawableElement} from "../plot-drawable-element";

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

    this.plotOptions = PlotOptionsClassFactory.buildPlotOptionsClass(extend(BarsPlotOptionsDefaults.Instance, options)) as BarsPlotOptionsClass;
  }

  protected create1DPlotElements(xDimension: DimensionValue<XDimensionType>[]): Array<PlotDrawableElement> {

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

          let gradient = context.createLinearGradient(screenLocation.x, minY, screenLocation.x, zero.y);
          gradient.addColorStop(0, barsColoring.fillGradient.min.toString());
          gradient.addColorStop(0.4, barsColoring.fillGradient.min.toString());
          gradient.addColorStop(1, barsColoring.fillGradient.max.toString());
          context.setAttr('fillStyle', gradient);
          context.setAttr('strokeStyle', barsColoring.stroke.toString());
          context.setAttr('lineWidth', 1);

          for (let ptIdx = 0; ptIdx < metricPoints.length; ptIdx++) {

            let rectX: number | undefined;
            let rectY: number | undefined;
            let rectW: number | undefined;
            let rectH: number | undefined;

            if (metricIdx == 0) {
              let pointLocation = metricPoints[ptIdx];
              rectX = MathHelper.optimizeValue(pointLocation.x - barWidthWithMargin / 2);
              rectY = 0;
              rectW = MathHelper.optimizeValue(barWidthWithMargin);
              rectH = MathHelper.optimizeValue(pointLocation.y);
            } else {
              let pointLocation = metricPoints[ptIdx];
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
              context.beginPath();
              context.rect(rectX, rectY, rectW, rectH);
              context.closePath();
              context.fill()
              context.stroke();

              if (this.plotOptions.drawLabelsOnBars) {
                context.save();

                context.beginPath();
                context.rect(rectX, rectY, rectW, rectH);
                context.clip();

                context.setAttr('fillStyle', this.plotOptions.foregroundColor.toString());
                this.setContextFont(context, this.plotOptions.font);

                let labelText: string = metricValues[ptIdx].toFixed(this.plotOptions.labelsPrecision);

                let textWidth = context.measureText(labelText).width;

                let pointLocation = metricPoints[ptIdx];

                let x = pointLocation.x - textWidth / 2;
                let h = pointLocation.y;

                this.labelsHeight = this.labelsHeight ??
                  this.textMeasureUtils!.measureFontHeight(this.plotOptions.font);

                let y = h + this.labelsHeight + 2;
                context.fillText(labelText, x, y);
                context.restore();
              }
            }
          }
        }

        prevMetricPts = metricPoints;
      }
    }
  }

  protected updateDrawableElementShape(element: PlotDrawableElement, visible: DataRect, screen: DataRect): void {
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

  protected create2DPlotElements(context: Konva.Context, shape: Konva.Shape, xDimension: DimensionValue<XDimensionType>[], yDimension: DimensionValue<Exclude<YDimensionType, undefined>>[]): void {
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

        boundingRect = new DataRect(boundingRect.minX - screenHorizontalMargin / 2, boundingRect.minY, boundingRect.width + screenHorizontalMargin, boundingRect.height);
        boundingRect = boundingRect.merge(new DataRect(boundingRect.minX, 0, boundingRect.width, 0));
      }
    }
    return boundingRect;
  }
}
