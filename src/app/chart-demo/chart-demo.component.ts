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
    let frequency = 10;
    let width = 100;
    let height = 200;

    function generateSinData(origin: number, count: number): XY[]{
      return [...Array(count).keys()].map((val, idx) => {
        let x = (idx + origin);
        let y = height / 2 + amplitude * Math.sin(x / frequency);
        return {x: x, y: y}
      })
    }

    let origin = 0;
    let count = 300;

    let data = generateSinData(0, count);

    origin = count;

    let dataSet = new DataSet<XY, number>(
      data,
      {
        y: {
          func: item => {
            return item.y
          }
        }
      },
      item => {
        return item.x
      }
    );

    let requestAnimationFrame = window.requestAnimationFrame ||
    function (callback: any) {
      window.setTimeout(callback, 1000 / 60);
    };

    let updateChartData = function(){

      data.shift()
      data.push(generateSinData(origin, 1)[0]);
      origin++;
      dataSet.update(data);

      requestAnimationFrame(updateChartData);
    }

    updateChartData();

    let chart = new Chart<XY, number>(
      "#chart-element",
      dataSet,
      {
        navigation: {
          isFitToViewModeEnabled: true
        },
        header: {
          text: "Заголовок графика"
        },
        plots: [
          {
            kind: PlotKind.Marker,
            metric: {
              id: "y",
              caption: "Y",
              color: new Color("#AA0000")
            },
            markerSize: 7
          } as MarkerPlotOptions
        ]
      }
    )
  }
}
