---
layout: libdoc/page-split
unlisted: false
title: Date Time Axis
category: Demos
---

See the code below for a simple example of a Marker Plot visualization with Date Time horizontal axis.
Full documentation is available on the [Codesandbox.io](https://codesandbox.io/s/some-charts-date-time-axis-demo-g70khz?file=/src/app/date-time-axis-demo/date-time-axis-demo.component.ts)

To have a better understanding how it works, have a look at the entire code of the demo with an explanation of all the objects and attributes after it.

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

Please take a look into the Angular `ngOnInit` method, where we create and initialize all the stuff:

- `dataSet` defines initial state of a single-dimensional `DataSet` with a dimension **x** (with Date values) and a metric **y** defined on that dimension
  - `elements` an array which specifies initial DataSet data
  - `metrics` a dictionary of metrics by their id's. Each metric is defined by:
    - `func` a function which extracts metric value from `DataSet` data.
    - `isArray` a boolean property indicating whether metric value is an array of values or not. For this demo it has false value.
    - `dimensionXFunc` a function to extract first dimension value out of an array of elements,
    - `dimensionYFunc` a function to extract second dimension value out of an array of elements. Only relevant for 2D Data Sets so in this example it's undefined.
    - `dimensionsSorting` a sorting function being applied to both dimensions values to place them in order. For this demo, we have use default value for this attribute. Therefore we use `Sorting.Asc` value here.

`new Chart<XY, Date>('#chart-element',...)` creates chart for given data, options and attributes using [Chart constructor](/typedoc/classes/Chart.html) with parameters:
- `elementSelector`: string `"#chart-element"`, which specifies selector to an HTML element where chart should be rendered
- `dataSet` :DataSet<TItemType, XDimensionType, YDimensionType> specified data set for this chart;
- `options`: `ChartOptions` object which specifies how to render this chart in a declarative way (see [Chart options](/typedoc/interfaces/ChartOptions.html)).

`ChartOptions` for this demo is initialized with the following set of attributes:

- `header` attribute defines text displayed on the top of chart;
- `plots` - an array of plots to display on this chart. For this demo, we render a `Marker` plot. So we need to create a new `MarkerPlotOptions` object.

kind` - defines kind of a plot to draw (in this demo - `PlotKind.Marker`)

- `metric` - a metric for the plot. For metric, the following attributes must be specified,
  - `id` specifies metric id in the Data Set
  - `caption` specifies metric caption in legend and in other places.
  - `color` specifies metric color, when it's been visualized on a plot.

- `markerSize` defines marker size in pixels.

The `axes` object defines types of axes to use for a horizontal and vertical axes. In this Demo, we use Labeled horizontal ( we use `AxisTypes.LabeledAxis`) and numeric vertical (we use `AxisTypes.NumericAxis`) axes.

Playground iframe for this demo is shown on the right pane
```html
<iframe src="https://codesandbox.io/embed/some-charts-date-time-axis-demo-g70khz?fontsize=14&hidenavigation=1&theme=light"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Some Charts Date Time Axis Demo"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
```
{:.playground title="Date-Time Axis Playground"}
