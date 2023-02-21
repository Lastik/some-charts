---
layout: libdoc/page-split
unlisted: false
title: Bars Plot
category: Demos
---

## Bars-Plot demo

This page contains description of the Bars Plot demo.
Full documentation is available on the [Codesandbox.io](https://codesandbox.io/s/some-charts-bars-demo-3g0jf6?file=/src/app/bars-demo/bars-demo.component.ts)

```javascript
import {Component, OnInit} from '@angular/core';
import {AxisTypes, BarsPlotOptions, Chart, DataSet, Margin, PlotKind, Skin, Sorting} from "some-charts";
import * as Color from "color";
import {XY} from "./model/x-y";

@Component({
  selector: 'bars-demo',
  templateUrl: './bars-demo.component.html'
})
export class BarsDemoComponent implements OnInit {


  ngOnInit(): void {

    let self = this;

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

    function updateDataSet() {
      dataSet.update([{
        x: 'first',
        y1: self.getRandomInt(8, 12),
        y2: self.getRandomInt(15, 20),
      }, {
        x: 'second',
        y1: self.getRandomInt(8, 12),
        y2: self.getRandomInt(15, 20),
      }, {
        x: 'third',
        y1: self.getRandomInt(8, 12),
        y2: self.getRandomInt(15, 20),
      }, {
        x: 'fourth',
        y1: self.getRandomInt(8, 12),
        y2: self.getRandomInt(15, 20),
      }])
      setTimeout(updateDataSet, 4000);
    }

    setTimeout(updateDataSet, 4000);

    let chart = new Chart<XY, string>(

      '#chart-element',
      dataSet,
      {
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
              color: new Color("#D24E4D")
            },{
              id: 'y2',
              caption: 'Y2',
              color: new Color("#43bc82")
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

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
```

The code snippet of `bars-demo.component.ts` above starts with import statements that provide needed bindings from  external modules:


- Angular/core bindings (`Component`, `OnInit`);
- some-charts bindings (`AxisTypes`, `BarsPlotOptions`, `Chart`, `DataSet`, `Margin`, `PlotKind`, `Skin`, `Sorting`);

Angular component
 ```javascript  
@Component({
  selector: 'bars-demo',
  templateUrl: './bars-demo.component.html'
}) ...
```
defines ”placeholder” for the demo component on the webpage.

In the Angular `ngOnInit` method implements creation and initializations needed for the demo objects:

- `dataSet` defines initial values for displayed data, interfaces and options;
- function `updateDataSet` implements randomized data update by timer.
- `setTimeout(updateDataSet, 4000)` sets dataset update interval to 4 seconds (4000 milliseconds)

`new Chart<XY, Date>('#chart-element',...)`  creates chart for given data, options and attributes by calling [Chart constructor](typedoc/classes/Chart.html) with needed parameters:
- `elementSelector`: string `"#chart-element"`
- `dataSet` :DataSet<TItemType, XDimensionType, YDimensionType>, contains data for this chart;
- `options`: ChartOptions - [Chart options](typedoc/interfaces/ChartOptions.html).  
  ChartOptions in this demo contains:

- navigation object
 ```javascript 
 navigation: {
          isFitToViewModeEnabled: true,
          relativePadding: new Margin(0, 0.1, 0, 0.1)
        }
```
has two properties 	`isFitToViewModeEnabled` that enables .... and `relativePadding` that defines margins for the plot area;

- `header` objects defines text displayed on the top of chart;
- plots object is array of one object `BarsPlotOptions` that defines options to fraw boxes.

Object `BarsPlotOptions` has three properties:

`kind` - defines selected type of drawing (in this example - `PlotKind.Box`)

`metric` defines Y ????? and color as RGB color value `Color('#F47174')`(light red)

`animate` defines if smooth drawing update when data has changed is needed


The `axes` object defines kind of labels for horizontal axis as text labels  (`AxisTypes.LabeledAxis`) and vertical as axis with numeric labels (`AxisTypes.NumericAxis`)

Playground iframe for this demo is shown on the right pane
```html
<iframe src="https://codesandbox.io/embed/some-charts-bars-demo-3g0jf6?fontsize=14&hidenavigation=1&theme=dark" 
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Some Charts Bars Demo"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
```
{:.playground title="Bars-Plot Playground"}
