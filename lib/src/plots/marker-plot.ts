import {Plot} from "../core";
import Konva from "konva";
import {MarkerPlotOptions, MarkerPlotOptionsDefaults} from "../options";
import {DataSet} from "../core/data";
import extend from "lodash-es/extend";

export class MarkerPlot<TItemType,
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined>
    extends Plot<MarkerPlotOptions, TItemType, XDimensionType, YDimensionType>{

  constructor(dataSet: DataSet<TItemType, XDimensionType, YDimensionType>, options: MarkerPlotOptions) {
    super(dataSet, options);

    this.plotOptions = extend(MarkerPlotOptionsDefaults.Instance, options);
  }

  protected drawFunc(context: Konva.Context, shape: Konva.Shape): void {

    let screen = this.screen;
    if(screen) {
      let screenLocaton = screen.getMinXMinY();
      let screenSize = screen.getSize();

      context.save();
      context.beginPath();
      context.rect(screenLocaton.x + 0.5, screenLocaton.y + 0.5, screenSize.width - 0.5, screenSize.height - 0.5);
      context.clip();

      let xDimension = this.dataSet.dimensionXValues;
      let yDimension = this.dataSet.dimensionYValues;

      let is2D = this.dataSet.is2D;

      this.dataSet.getMetricValues(this.plotOptions.metric);

      xDimension.forEach((xDimVal, xIdx)=>{
        if()
      });
      for(let xDimensionValue, xDimensionIdx in xDimension)

      for (let i = 0; i < dataSource.length; i++) {
        let point = dataSource[i];
        let pointLocation = CoordinateTransform.dataToScreenXY(point, self._visible, screenSize);

        pointLocation.x += screenLocaton.x;
        pointLocation.y += screenLocaton.y;

        context.beginPath();
        context.arc(pointLocation.x, pointLocation.y, self.markerSize, 0, Math.PI * 2, true);
        context.fillStyle = self.markerFill;
        context.fill();
        context.lineWidth = 1;
        context.stroke();
      }

      context.stroke();
      context.restore();
    }
  }

}
