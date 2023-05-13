import {Component, OnInit} from '@angular/core';
import {
  AxisTypes,
  BoxOutliersPlotOptions,
  BoxPlotOptions,
  Chart,
  DataSet,
  Margin,
  PlotKind,
  Skin,
  Sorting
} from "../../../../some-charts-lib/src";
import * as Color from "color";
import {XY} from "./model/x-y";
import {MathHelperService} from "../services/math-helper.service";

@Component({
  selector: 'box-demo',
  templateUrl: './box-demo.component.html'
})
export class BoxDemoComponent implements OnInit {


  constructor(private mathHelperService: MathHelperService) {
  }

  ngOnInit(): void {

    let dataSet = new DataSet<XY, string>(
      [{
        x: 'first',
        y: [650, 540, 700, 807, 730, 650, 740, 780, 780, 680, 800, 780, 720, 450, 560, 610, 800, 850],
      }, {
        x: 'second',
        y: [740, 740, 740, 740, 680, 640, 640, 680, 700, 640, 620, 590, 620, 680, 680, 650, 600, 580]
      }, {
        x: 'third',
        y: [610, 680, 660, 660, 520, 540, 410, 660, 770, 750, 660, 710, 630, 670, 640, 640, 650, 630],
      }, {
        x: 'fourth',
        y: [10, 640, 610, 620, 600, 570, 560, 540, 550, 560, 710, 720, 690, 660, 640, 520, 640, 610],
      }],
      {
        y: {
          func: item => {
            return item.y
          },
          isArray: true
        }
      },
      item => {
        return item.x
      },
      undefined,
      Sorting.None
    );

    let updateDataSet = () => {
      dataSet.update([{
        x: 'first',
        y: [650, 540, 700, 807, 730,
          this.mathHelperService.getRandomInt(450, 700), 740,
          this.mathHelperService.getRandomInt(450, 800), 780,
          this.mathHelperService.getRandomInt(450, 800), 800, 780, 720, 450, 560, 610, 800, 850],
      }, {
        x: 'second',
        y: [740, 740, 740, 740,
          this.mathHelperService.getRandomInt(450, 700), 640, 640, 680,
          this.mathHelperService.getRandomInt(450, 700), 640, 620, 590,
          this.mathHelperService.getRandomInt(450, 700), 680, 680, 650, 600, 580]
      }, {
        x: 'third',
        y: [610, 680, 660, 660, 520, 540, 410, 660, 770, 750, 660, 710, 630, 670, 640, 640, 650, 630],
      }, {
        x: 'fourth',
        y: [this.mathHelperService.getRandomInt(5, 200), 640, 610,
          this.mathHelperService.getRandomInt(350, 600), 600, 570,
          this.mathHelperService.getRandomInt(350, 600), 540,
          this.mathHelperService.getRandomInt(350, 600), 560, 710, 720,
          this.mathHelperService.getRandomInt(350, 700), 660, 640, 520, 640, 610],
      }])

      setTimeout(updateDataSet, 4000)
    }

    setTimeout(updateDataSet, 4000);

    let chart = new Chart<XY, string>(

      '#chart-element',
      dataSet,
      {
        skin: Skin.Light,
        navigation: {
          isFitToViewModeEnabled: true,
          relativePadding: new Margin(0, 0.1, 0, 0.1)
        },
        header: {
          text: 'Box chart'
        },
        plots: [
          {
            kind: PlotKind.Box,
            metric: {
              id: 'y',
              caption: 'Box',
              color: new Color("#F47174")
            },
            animate: true
          } as BoxPlotOptions,
          {
            kind: PlotKind.BoxOutliers,
            metric: {
              id: 'y',
              caption: 'Outliers',
              color: new Color("#66AADE")
            },
            animate: true
          } as BoxOutliersPlotOptions
        ],
        axes: {
          horizontal: {
            axisType: AxisTypes.LabeledAxis
          },
          vertical: {
            axisType: AxisTypes.NumericAxis
          }
        }
      }
    );
  }
}
