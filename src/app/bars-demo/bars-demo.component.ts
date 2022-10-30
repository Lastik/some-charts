import {Component, OnInit} from '@angular/core';
import {AxisTypes, BarsPlotOptions, Chart, DataRect, DataSet, MarkerPlotOptions, PlotKind} from "some-charts";
import * as Color from "color";
import {XY} from "./model/x-y";
import {Sorting} from "../../../projects/some-charts-lib/src";

@Component({
  selector: 'bars-demo',
  templateUrl: './bars-demo.component.html'
})
export class BarsDemoComponent implements OnInit {


  constructor() {
  }

  ngOnInit(): void {

    let dataSet = new DataSet<XY, string>(
      [{
        x: 'first',
        y: 10
      }, {
        x: 'second',
        y: 20
      }, {
        x: 'third',
        y: 30
      }, {
        x: 'fourth',
        y: 15
      }],
      {
        y: item => {
          return item.y
        }
      },
      item => {
        return item.x
      },
      undefined,
      Sorting.None
    );

    let chart = new Chart<XY, string>(
      '#chart-element',
      dataSet,
      {
        header: {
          text: 'Заголовок графика'
        },
        plots: [
          {
            kind: PlotKind.Bars,
            metrics: [{
              name: 'y',
              caption: 'Y',
              color: new Color("#AA0000")
            }]
          } as BarsPlotOptions
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
