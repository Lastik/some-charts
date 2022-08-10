import Konva from "konva";
import extend from "lodash-es/extend";
import {DataTransformation, NumericPoint} from "../index";
import {BarsPlotOptions, BarsPlotOptionsDefaults} from "../index";
import {DataSet, DimensionValue} from "../data";
import {Plot} from "./plot";

export class BarsPlot<TItemType,
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined>
  extends Plot<BarsPlotOptions, TItemType, XDimensionType, YDimensionType> {

  constructor(dataSet: DataSet<TItemType, XDimensionType, YDimensionType>,
              dataTransformation: DataTransformation,
              options: BarsPlotOptions) {
    super(dataSet, dataTransformation, options);

    this.plotOptions = extend(BarsPlotOptionsDefaults.Instance, options);
  }

  protected draw1DData(context: Konva.Context, shape: Konva.Shape, xDimension: DimensionValue<XDimensionType>[]): void {
    if (this.visible && this.screen) {
      let screenLocation = this.screen.getMinXMinY();
      let screenSize = this.screen.getSize();
      let verticalVisibleRange = this.visible.getVerticalRange();

      let zero = this.dataTransformation.dataToScreenRegionXY(new NumericPoint(0, 0), this.visible, this.screen);
      let zeroY = zero.y;
      let minY = zero.y;

      let barsWidths = [];

      let isSingleBar = false;

      for (let metric of this.plotOptions.metrics) {
        barsWidths.push(this.calculateBarsWidth(metric.name));
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

      for (let metric of this.plotOptions.metrics) {

        verticalVisibleRange.y += screenLocation.y;

        let transformedPts = transformedPtsArr[ind];
        let prevTransformedPts = null;
        if (ind != 0) {
          prevTransformedPts = transformedPtsArr[ind - 1];
        }

        let w = barsWidths[ind];

        let barRenderWidthPlusMargin = w;

        if (singlePointSeriesCollection) {
          w *= 0.45;
        } else {
          w *= 0.7;
        }


        let colorSet = null;

        if (dataSeries.__3109a40634724206b105b25395ff9857 == undefined) {
          let colorSet = self._calculateBarsColors(dataSeries.color);
          dataSeries.__3109a40634724206b105b25395ff9857 = colorSet;
        } else {
          colorSet = dataSeries.__3109a40634724206b105b25395ff9857;
        }
        let gradient = context.createLinearGradient(screenLocation.x, minY, screenLocation.x, zero.y);
        gradient.addColorStop(0, colorSet.fill1);
        gradient.addColorStop(0.4, colorSet.fill1);
        gradient.addColorStop(1, colorSet.fill2);
        context.fillStyle = gradient;

        context.strokeStyle = colorSet.stroke;

        context.lineWidth = 1;

        let barsRenderLeftX = null;

        if (dataSource.length > 0) {
          let first = transformedPts[0];

          let minX = first.x - barRenderWidthPlusMargin / 2;
          barsRenderLeftX = minX;
        }

        self._barsRenderLeftOffset = barsRenderLeftX;
        self._barsRenderWidth = barRenderWidthPlusMargin;

        self.eventTarget.fire(new BarsRenderedEvent(barsRenderLeftX, barRenderWidthPlusMargin));

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
      }
      /**Clipping*/
      context.restore();
      /***********/
    }
  }

  /**
   * Calculates bars width for metric name.
   * @param {string} metricName - metric name
   * */
  private calculateBarsWidth(metricName: string): number | undefined {

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

  protected draw2DData(context: Konva.Context, shape: Konva.Shape, xDimension: DimensionValue<XDimensionType>[], yDimension: DimensionValue<Exclude<YDimensionType, undefined>>[]): void {
    throw new Error(Plot.errors.doesntSupport2DData);
  }
}
