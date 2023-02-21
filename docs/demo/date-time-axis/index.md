---
layout: libdoc/page-split
unlisted: false
title: Date Time Axis
category: Demos
---

## Date-Time Axis demo

This page contains description of the Date Time Axis Demo.
Full documentation is available on the [Codesandbox.io](https://codesandbox.io/s/some-charts-date-time-axis-demo-g70khz?file=/src/app/date-time-axis-demo/date-time-axis-demo.component.ts)

```javascript
import {Component, OnInit} from '@angular/core';
import {AxisTypes, Chart, DataRect, DataSet, MarkerPlotOptions, PlotKind, Skin} from "some-charts";
import * as Color from "color";
import {XY} from "./model/x-y";

@Component({
  selector: 'date-time-axis-demo',
  templateUrl: './date-time-axis-demo.component.html'
})
export class DateTimeAxisDemoComponent implements OnInit {

  ngOnInit(): void {

    let amplitude = 40;
    let frequency = 7;
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
    let count = 200;

    let data = generateSinData(0, count);

    origin = count;

    let dataSet = new DataSet<XY, Date>(
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

    new Chart<XY, Date>(
      '#chart-element',
      dataSet,
      {
        skin: Skin.Dark,
        header: {
          text: 'Date Time Axis'
        },
        plots: [
          {
            kind: PlotKind.Marker,
            metric: {
              id: 'y',
              caption: 'Y',
              color: new Color("#ff392e")
            },
            markerSize: 6
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

```

The code snippet of `box-demo.component.ts` above starts with import statements that provide needed bindings from  external modules:

- Angular/core bindings (`Component`, `OnInit`);
- some-charts bindings (`AxisTypes`, `Chart`, `DataRect`, `DataSet`,`MarkerPlotOptions`, `PlotKind`, `Skin`);

Angular component
 ```javascript  
@Component({
  selector: 'date-time-axis-demo',
  templateUrl: './date-time-axis-demo.component.html'
}) ...
```
defines ”placeholder” for the demo component on the webpage.

In the Angular `ngOnInit` method implements creation and initialization needed for the demo variables and objects:

- `dataSet` defines structure ans data for demo;
- function `generateSinData` implements dataSet values calculation.

`new Chart<XY, Date>('#chart-element',...)` creates chart for given data, options and attributes using [Chart constructor](typedoc/classes/Chart.html) with parameters:
- `elementSelector`: string `"#chart-element"`
- `dataSet` :DataSet<TItemType, XDimensionType, YDimensionType>, contains data for this chart;
- `options`: ChartOptions - [Chart options](typedoc/interfaces/ChartOptions.html).  
  ChartOptions in this demo contains
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
<iframe src="https://codesandbox.io/embed/some-charts-date-time-axis-demo-g70khz?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Some Charts Date Time Axis Demo"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
```
{:.playground title="Date-Time Axis Playground"}
