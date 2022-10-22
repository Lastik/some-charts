import {Component, OnInit} from '@angular/core';
import {AxisTypes, Chart, DataRect, DataSet, MarkerPlotOptions, PlotKind} from "some-charts";
import * as Color from "color";
import {XY} from "./model/x-y";

@Component({
  selector: 'chart-demo',
  templateUrl: './date-time-axis.component.html'
})
export class DateTimeAxisComponent implements OnInit {


  constructor() {
  }

  ngOnInit(): void {

    let amplitude = 40;
    let frequency = 20;
    let width = 100;
    let height = 200;

    let originDate = new Date();

    function generateSinData(origin: number, count: number): XY[]{
      return [...Array(count).keys()].map((val, idx) => {
        let x = (idx + origin);
        let y = height / 2 + amplitude * Math.sin(x / frequency);
        return {x: new Date(originDate.getTime() + x * 1000 * 60 * 60), y: y}
      })
    }

    let origin = 0;
    let count = 300;

    let data = generateSinData(0, count);

    origin = count;

    let dataSet = new DataSet<XY, Date>(
      data,
      {
        y: item => {
          return item.y
        }
      },
      item => {
        return item.x
      }
    );

    /*setInterval(function (){
      data.shift()
      data.push(generateSinData(origin, 1)[0]);
      origin++;
      dataSet.replace(data);
    }, 1000 / 60)*/

    let chart = new Chart<XY, Date>(
      '#chart-element',
      dataSet,
      {
        header: {
          text: 'Заголовок графика'
        },
        plots: [
          {
            kind: PlotKind.Marker,
            metric: {
              name: 'y',
              caption: 'Y',
              color: new Color("#AA0000")
            },
            markerSize: 10
          } as MarkerPlotOptions
        ],
        axes: {
          horizontal: {
            axisType: AxisTypes.DateAxis
          },
          vertical: {
            axisType: AxisTypes.NumericAxis
          }
        }
      }
    );
  }
}
