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
        y1: 10,
        y2: 15,
      }, {
        x: 'second',
        y1: 20,
        y2: 25,
      }, {
        x: 'third',
        y1: 30,
        y2: 35,
      }, {
        x: 'fourth',
        y1: 15,
        y2: 20,
      }],
      {
        y1: item => {
          return item.y1
        },
        y2: item => {
          return item.y2
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
              name: 'y1',
              caption: 'Y1',
              color: new Color("#AA0000")
            },{
              name: 'y2',
              caption: 'Y2',
              color: new Color("#00AA00")
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