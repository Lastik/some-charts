import Konva from "konva";
import merge from "lodash-es/merge";
import {BarsPlotOptions, BarsPlotOptionsDefaults, PlotOptionsClassFactory} from "../../../options";

import {DataTransformation, NumericDataRect, Range} from "../../../geometry";
import {DataSet, DimensionValue} from "../../../data";
import {Plot} from "../plot";
import {BarsColoring} from "./bars-coloring";
import * as Color from "color";
import {FontHelper, MathHelper} from "../../../services";
import {BarsPlotOptionsClass} from "../../../options/plot/bars";
import {PlotDrawableElement} from "../plot-drawable-element";
import {Bar} from "./bar";
import {cloneDeep} from "lodash-es";

export class BarsPlot<TItemType,
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined>
  extends Plot<BarsPlotOptions, BarsPlotOptionsClass, TItemType, XDimensionType, YDimensionType> {

  private barMaxWidthMap: Map<string, number> = new Map<string, number>();
  private colorsByMetricName?: Map<string, BarsColoring>;

  constructor(dataSet: DataSet<TItemType, XDimensionType, YDimensionType>,
              dataTransformation: DataTransformation,
              options: BarsPlotOptions) {
    super(dataSet, dataTransformation, options);
  }

  override buildPlotOptionsClass(plotOptions: BarsPlotOptions): BarsPlotOptionsClass {
    return PlotOptionsClassFactory.buildPlotOptionsClass(merge(cloneDeep(BarsPlotOptionsDefaults.Instance), plotOptions)) as BarsPlotOptionsClass;
  }

  override init(plotOptionsClass: BarsPlotOptionsClass) {
    this.colorsByMetricName = new Map(this.plotOptions.metrics.map(m => [m.name, this.getBarsColoring(m.color)]));
  }

  protected add1DPlotElement(xDimVal: DimensionValue<XDimensionType>): PlotDrawableElement | undefined {
    let drawableElement: PlotDrawableElement | undefined;

    for (let metricIdx = this.plotOptions.metrics.length - 1; metricIdx >= 0; metricIdx--) {
      let metric = this.plotOptions.metrics[metricIdx];
      let prevMetric = metricIdx !== 0 ? this.plotOptions.metrics[metricIdx - 1] : undefined;

      let metricValue = this.dataSet.getMetricValue(metric.name, xDimVal.value);

      if (metricValue) {

        let barsColoring = this.colorsByMetricName?.get(metric.name)!;

        let sampleRectShape = new Konva.Rect({
          stroke: barsColoring.stroke.toString(),
          strokeWidth: 1,
          fillLinearGradientStartPoint: {x: 0, y: 0},
          fillLinearGradientEndPoint: {x: 0, y: 50},
          fillLinearGradientColorStops: [
            0,
            barsColoring.fillGradient.min.toString(),
            0.4,
            barsColoring.fillGradient.max.toString(),
            1,
            barsColoring.fillGradient.max.toString()],
        })


        let pointLocation = this.getMetricPoint1D(metric.name, xDimVal);
        let rect: NumericDataRect | undefined = this.getBarRectForMetric(metric.name, prevMetric?.name, xDimVal);

        if (pointLocation && rect) {

          let group = new Konva.Group({
            /*clipFunc: function (ctx) {
              if (rect) {
                ctx.rect(0, 0, rect.width, rect.height);
              }
            }*/
          });

          let rectShape = sampleRectShape.clone();

          group.add(rectShape);

          let label: Konva.Text | undefined;

          if (this.plotOptions.drawLabelsOnBars) {

            let labelText: string = metricValue.toFixed(this.plotOptions.labelsPrecision);

            label = new Konva.Text({
              text: labelText,
              fill: this.plotOptions.foregroundColor.toString(),
              stroke: this.plotOptions.foregroundColor.toString(),
              font: FontHelper.fontToString(this.plotOptions.font)
            })

            group.add(label);
          }

          drawableElement = new Bar(pointLocation, rect, group, rectShape, label);
        }
      }
    }

    return drawableElement;
  }

  protected add2DPlotElement(xDimVal: DimensionValue<XDimensionType>, yDimVal: DimensionValue<Exclude<YDimensionType, undefined>>): PlotDrawableElement {
    throw new Error('Bars plot doesn\'t support 2D rendering');
  }

  protected update1DPlotElement(plotElt: PlotDrawableElement, xDimVal: DimensionValue<XDimensionType>) {
    for (let metricIdx = this.plotOptions.metrics.length - 1; metricIdx >= 0; metricIdx--) {
      let metric = this.plotOptions.metrics[metricIdx];
      let prevMetric = metricIdx !== 0 ? this.plotOptions.metrics[metricIdx - 1] : undefined;

      let metricValue = this.dataSet.getMetricValue(metric.name, xDimVal.value);

      if (metricValue) {

        let pointLocation = this.getMetricPoint1D(metric.name, xDimVal);
        let rect = this.getBarRectForMetric(metric.name, prevMetric?.name, xDimVal);

        if (pointLocation && rect) {
          let bar = plotElt as Bar;
          bar.setBarBounds(rect);
          bar.setBarLabel(metricValue.toFixed(this.plotOptions.labelsPrecision));
        }
      }
    }
  }

  protected update2DPlotElement(plotElt: PlotDrawableElement, xDimVal: DimensionValue<XDimensionType>, yDimVal: DimensionValue<Exclude<YDimensionType, undefined>>): PlotDrawableElement {
    throw new Error('Bars plot doesn\'t support 2D rendering');
  }

  private getBarRectForMetric(metricName: string, prevMetricName: string | undefined, xDimVal: DimensionValue<XDimensionType>): NumericDataRect | undefined {
    let rectX: number | undefined;
    let rectY: number | undefined;
    let rectW: number | undefined;
    let rectH: number | undefined;

    let pointLocation = this.getMetricPoint1D(metricName, xDimVal);
    let barWidthWithMargin = this.calculateBarMaxWidth(metricName);
    if (pointLocation && barWidthWithMargin) {
      if (!prevMetricName) {
        rectX = MathHelper.optimizeValue(pointLocation.x - barWidthWithMargin / 2);
        rectY = 0;
        rectW = MathHelper.optimizeValue(barWidthWithMargin);
        rectH = MathHelper.optimizeValue(pointLocation.y);
      } else {
        let prevPointLocation = this.getMetricPoint1D(prevMetricName, xDimVal);

        if (prevPointLocation) {

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
      }
    }

    if (rectX !== undefined && rectY !== undefined && rectW !== undefined && rectH !== undefined) {
      return NumericDataRect.apply(rectX, rectY, rectW, rectH);
    }
    else return undefined;
  }

  /**
   * Calculates bar available width for metric name.
   * @param {string} metricName - metric name
   * */
  private calculateBarMaxWidth(metricName: string): number | undefined {

    if (this.barMaxWidthMap.has(metricName)) {
      return this.barMaxWidthMap.get(metricName);
    } else {
      let metricPoints = this.getMetricPoints1D(metricName);

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
        this.barMaxWidthMap.set(metricName, barWidth);
      }

      return barWidth;
    }
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

  override clearPreCalculatedDataSetRelatedData(){
    super.clearPreCalculatedDataSetRelatedData();
    this.barMaxWidthMap.clear();
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
