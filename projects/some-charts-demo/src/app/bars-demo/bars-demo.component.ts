import {Component, OnInit} from '@angular/core';
import {AxisTypes, BarsPlotOptions, Chart, DataSet, Margin, PlotKind, Skin, Sorting} from "../../../../some-charts-lib/src";
import {XY} from "./model/x-y";
import {MathHelperService} from "../services/math-helper.service";

@Component({
  selector: 'bars-demo',
  templateUrl: './bars-demo.component.html'
})
export class BarsDemoComponent implements OnInit {


  constructor(private mathHelperService: MathHelperService) {
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
        y1: {
          func: item => {
            return item.y1
          }
        },
        y2: {
          func: item => {
            return item.y2
          }
        }
      },
      item => {
        return item.x
      },
      undefined,
      Sorting.None
    );

    const updateDataSet = () => {
      dataSet.update([{
        x: 'first',
        y1: this.mathHelperService.getRandomInt(8, 12),
        y2: this.mathHelperService.getRandomInt(15, 20),
      }, {
        x: 'second',
        y1: this.mathHelperService.getRandomInt(8, 12),
        y2: this.mathHelperService.getRandomInt(15, 20),
      }, {
        x: 'third',
        y1: this.mathHelperService.getRandomInt(8, 12),
        y2: this.mathHelperService.getRandomInt(15, 20),
      }, {
        x: 'fourth',
        y1: this.mathHelperService.getRandomInt(8, 12),
        y2: this.mathHelperService.getRandomInt(15, 20),
      }])
      setTimeout(updateDataSet, 4000);
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
          text: 'Bars Plot'
        },
        plots: [
          {
            kind: PlotKind.Bars,
            metrics: [{
              id: 'y1',
              caption: 'Y1',
              color: "#D24E4D"
            },{
              id: 'y2',
              caption: 'Y2',
              color: "#43bc82"
            }],
            animate: true
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
