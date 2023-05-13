---
layout: libdoc/page-split
unlisted: false
title: Bars Plot
category: Demos
---

See the code below for a simple example of Bars Plot visualization.
Full documentation is available on the [Codesandbox.io](https://codesandbox.io/s/some-charts-bars-demo-3g0jf6?file=/src/app/bars-demo/bars-demo.component.ts)

To have a better understanding how it works, have a look at the entire code of the demo with an explanation of all the objects and attributes after it.

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

Please take a look into the Angular `ngOnInit` method, where we create and initialize all the stuff:

- `dataSet` defines initial state of a single-dimensional `DataSet` with a dimension **x** and two metrics **y1** and **y2** defined on that dimension;
  - `elements` an array which specifies initial DataSet data
  - `metrics` a dictionary of metrics by their id's. Each metric is defined by:
    - `func` a function which extracts metric value from `DataSet` data.
    - `isArray` a boolean property indicating whether metric value is an array of values or not. For this demo it has false value.
    - `dimensionXFunc` a function to extract first dimension value out of an array of elements,
    - `dimensionYFunc` a function to extract second dimension value out of an array of elements. Only relevant for 2D Data Sets so in this example it's undefined.
    - `dimensionsSorting` a sorting function being applied to both dimensions values to place them in order. For this demo, we have string `x` dimension, so we don't want our dimensions to be sorted. Therefore, we use `Sorting.None` value here.
- function `updateDataSet` performs randomized data update by timer.

Constructor `new Chart<XY, Date>('#chart-element',...)`  creates chart for a given data and provided options and attributes by calling [Chart constructor](/typedoc/classes/Chart.html) with the following set of parameters:
- `elementSelector`: string `"#chart-element"`, which specifies selector to an HTML element where chart should be rendered
- `dataSet` :DataSet<TItemType, XDimensionType, YDimensionType> specified data set for this chart;
- `options`: `ChartOptions` object which specifies how to render this chart in a declarative way (see [Chart options](/typedoc/interfaces/ChartOptions.html)).  

`ChartOptions` for this demo is initialized with the following set of attributes:

- `navigation` object with the following attributes:
    - `isFitToViewModeEnabled` which specifies that all the chart data must be fitted vertically and horizontally within the chart viewport
    - `relativePadding` which specifies additional padding applied from chart grid to chart data. This padding is specified in relative units.

- `header` attribute defines text displayed on top of the chart;
- `plots` - an array of plots to display on this chart. For this demo, we render a Bars plot, so we need to create a new `BarsPlotOptions` object, which specifies options for the Bars plot.

Object `BarsPlotOptions` has three properties:

- `kind` - defines kind of a plot to draw (in this demo - `PlotKind.Bars`)

- `metrics` - an array of metrics for the plot. For Bars plot, this can be one or multiple metrics, because bars can be *stacked* on top of each other. For each metric,
  - `id` specifies metric id in the Data Set
  - `caption` specifies metric caption in legend and in other places.
  - `color` specifies metric color, when it's been visualized on a plot.

- `animate` specifies if transitions of data in the `DataSet` between updates should be animated


The `axes` object defines types of axes to use for a horizontal and vertical axes. In this Demo, we use Labeled horizontal ( we use `AxisTypes.LabeledAxis`) and numeric vertical (we use `AxisTypes.NumericAxis`) axes.

Live demo with a sandbox is shown on the right pane
```html
<iframe src="https://codesandbox.io/embed/some-charts-bars-demo-3g0jf6?fontsize=14&hidenavigation=1&theme=light" 
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Some Charts Bars Demo"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
```
{:.playground title="Bars-Plot Playground"}
