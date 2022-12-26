import {Component, OnInit} from '@angular/core';
import {AxisTypes, BoxOutliersPlotOptions, BoxPlotOptions, Chart, DataSet, PlotKind, Skin, Sorting} from "some-charts";
import * as Color from "color";
import {XY} from "./model/x-y";

@Component({
  selector: 'box-demo',
  templateUrl: './box-demo.component.html'
})
export class BoxDemoComponent implements OnInit {


  constructor() {
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
      }, {
        x: 'fifth',
        y: [50, 640, 610, 620, 600, 570, 560, 540, 550, 560, 710, 720, 690, 660, 640, 520, 640, 610],
      }],
      {
        y: {
          func: item => {
            return item.y
          },
          isArrayLike: true
        }
      },
      item => {
        return item.x
      },
      undefined,
      Sorting.None
    );

    setTimeout(()=>{
      dataSet.update([{
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
        y: [100, 640, 610, 620, 600, 570, 560, 540, 550, 560, 710, 720, 690, 660, 640, 520, 640, 610],
      }, {
        x: 'fifth',
        y: [200, 640, 610, 620, 500, 570, 560, 540, 750, 560, 710, 420, 690, 460, 640, 520, 640, 610],
      }])
    }, 2000)

    let chart = new Chart<XY, string>(

      '#chart-element',
      dataSet,
      {
        skin: Skin.Light,
        navigation: {
          isFitToViewModeEnabled: true
        },
        header: {
          text: 'Box chart'
        },
        plots: [
          {
            kind: PlotKind.Box,
            metric: {
              id: 'y',
              caption: 'Y',
              color: new Color("#ff392e")
            },
            animate: true
          } as BoxPlotOptions,
          {
            kind: PlotKind.BoxOutliers,
            metric: {
              id: 'y',
              caption: 'Y',
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
