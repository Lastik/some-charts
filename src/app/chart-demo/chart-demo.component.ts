import {Component, OnInit} from '@angular/core';
import {Chart, DataRect, MarkerPlotOptions, NumericPoint, PlotKind, Size, DataSet} from "some-charts";
import * as Color from "color";
import {XY} from "./model/x-y";

@Component({
  selector: 'chart-demo',
  templateUrl: './chart-demo.component.html'
})
export class ChartDemoComponent implements OnInit {


  constructor() {
  }

  ngOnInit(): void {

    let amplitude = 40;
    let frequency = 20;
    let width = 100;
    let height = 200;

    function generateSinData(origin: number, count: number): XY[]{
      return [...Array(count).keys()].map((val, idx) => {
        let x = (idx + origin) * 2;
        let y = height / 2 + amplitude * Math.sin(x / frequency);
        return {x: x, y: y}
      })
    }

    let origin = 0;
    let count = 100;

    let data = generateSinData(0, count);

    origin = count;

    let dataSet = new DataSet<XY, number>(
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

    setInterval(function (){
      data.shift()
      data.push(generateSinData(origin, 1)[0]);
      origin++;
      dataSet.replace(data);
    }, 1000 / 10)

    let chart = new Chart<XY, number>(
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
        ]
      }
    )
  }
}
