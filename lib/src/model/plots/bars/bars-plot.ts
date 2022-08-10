import Konva from "konva";
import extend from "lodash-es/extend";
import {
  BarsPlotOptions,
  BarsPlotOptionsDefaults, DataRect,
  DataTransformation,
  NumericPoint,
  PlotOptionsClass
} from "../../index";
import {DataSet, DimensionValue} from "../../data";
import {Plot} from "../plot";
import {BarsColoring} from "./bars-coloring";
import * as Color from "color";
import {Range} from '../../geometry'
import {MathHelper} from "../../../services";
import {BarsPlotOptionsClass} from "../../options/plot/bars";

export class BarsPlot<TItemType,
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined>
  extends Plot<BarsPlotOptions, BarsPlotOptionsClass, TItemType, XDimensionType, YDimensionType> {

  constructor(dataSet: DataSet<TItemType, XDimensionType, YDimensionType>,
              dataTransformation: DataTransformation,
              options: BarsPlotOptions) {
    super(dataSet, dataTransformation, options);

    this.plotOptions = PlotOptionsClass.apply(extend(BarsPlotOptionsDefaults.Instance, options)) as BarsPlotOptionsClass;
  }

  protected draw1DData(context: Konva.Context, shape: Konva.Shape, xDimension: DimensionValue<XDimensionType>[]): void {
    if (this.visible && this.screen) {
      let screenLocation = this.screen.getMinXMinY();
      let screenSize = this.screen.getSize();

      let zero = this.dataTransformation.dataToScreenRegionXY(new NumericPoint(0, 0), this.visible, this.screen);
      let zeroY = zero.y;
      let minY = zero.y;

      let barAvailableWidthsMap: Map<string, number> = new Map<string, number>();

      let isSingleBar = false;

      for (let metric of this.plotOptions.metrics) {
        let barAvailableWidth = this.calculateBarMaxWidth(metric.name);
        if(barAvailableWidth) {
          barAvailableWidthsMap.set(metric.name, barAvailableWidth);
        }
        let screenPoints1D = this.getScreenPoints1D(metric.name);

        if(screenPoints1D?.length === 1){
          isSingleBar = true;
        }

        if(screenPoints1D){
          for(let point of screenPoints1D){
            minY = Math.min(minY, point.y);
          }
        }
      }

      for (let idx = this.plotOptions.metrics.length - 1; idx >= 0 ; idx--) {
        let metric = this.plotOptions.metrics[idx];
        let prevMetric = idx !== 0 ? this.plotOptions.metrics[idx - 1] : undefined;

        let transformedPts = this.getScreenPoints1D(metric.name);

        if (transformedPts) {

          let prevTransformedPts: NumericPoint[] | undefined =
            prevMetric ? this.getScreenPoints1D(metric.name) : undefined;

          let barWidthWithMargin: number = barAvailableWidthsMap.get(metric.name) ?? 0;

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

          let barsRenderLeftX = null;

          if (transformedPts.length > 0) {
            let firstPt = transformedPts[0];
            barsRenderLeftX = firstPt.x - barWidthWithMargin / 2;
          }

          self._barsRenderLeftOffset = barsRenderLeftX;
          self._barsRenderWidth = barRenderWidthPlusMargin;

          let zeroYOptimized = MathHelper.optimizeValue(zeroY);

          for (let i = 0; i < dataSource.length; i++) {

            let rectX = null;
            let rectY = null;
            let rectW = null;
            let rectH = null;

            if (ind == 0) {
              let pointLocation = transformedPts[i];

              let h = pointLocation.y - zeroY;

              let xOptimized = MathHelper.optimizeValue(pointLocation.x - w / 2);

              rectX = xOptimized;
              rectY = zeroYOptimized;
              rectW = MathHelper.optimizeValue(w);
              rectH = MathHelper.optimizeValue(h);
            } else {
              let pointLocation = transformedPts[i];
              let prevPointLocation = prevTransformedPts[i];

              let h = pointLocation.y - zeroY;

              let y = null;

              if (h < 0) {
                y = Math.min(prevPointLocation.y + 2, zeroY);
              } else if (h > 0) {
                y = Math.max(prevPointLocation.y - 2, zeroY);
              } else {
                y = zeroY;
              }

              rectX = MathHelper.optimizeValue(pointLocation.x - w / 2);
              rectY = MathHelper.optimizeValue(y);
              rectW = MathHelper.optimizeValue(w);
              rectH = MathHelper.optimizeValue(pointLocation.y - prevPointLocation.y);
            }

            if (rectH != 0) {
              context.beginPath();
              context.rect(rectX, rectY, rectW, rectH);
              context.closePath();
              context.fill()
              context.stroke();

              if (self._drawValueOnBars) {
                context.save();

                context.beginPath();
                context.rect(rectX, rectY, rectW, rectH);
                context.clip();

                context.fillStyle = self._labelsForeground;
                context.font = self._labelsFont;

                let value = parseFloat(dataSource[i].y.toFixed(self._labelsPrecision)).toString();
                let labelText = value + self._units;

                let textWidth = context.measureText(labelText).width;

                let pointLocation = transformedPts[i];

                let x = pointLocation.x - textWidth / 2;
                let h = pointLocation.y - zeroY;

                let textH = null;
                if (self._labelsFontCalculatedTextHeightFor != self._labelsFont) {
                  self._labelsFontCalculatedTextHeight = TextMeasureUtils.measureTextHeight(context, self._labelsFont);
                  self._labelsFontCalculatedTextHeightFor = self._labelsFont;
                }

                textH = self._labelsFontCalculatedTextHeight;

                let y = zeroY + h + textH + 2;
                context.fillText(labelText, x, y);
                context.restore();
              }
            }
          }

          prevTransformedPts = transformedPts;
        }
      }
      /**Clipping*/
      context.restore();
      /***********/
    }
  }

  /**
   * Calculates bar available width for metric name.
   * @param {string} metricName - metric name
   * */
  private calculateBarMaxWidth(metricName: string): number | undefined {

    let transformedPts = this.getScreenPoints1D(metricName);

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

  protected draw2DData(context: Konva.Context, shape: Konva.Shape, xDimension: DimensionValue<XDimensionType>[], yDimension: DimensionValue<Exclude<YDimensionType, undefined>>[]): void {
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
