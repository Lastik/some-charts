---
layout: libdoc/page-split
unlisted: false
title: Marker Plot
category: Demos
---

## Marker-Sin demo

This page contains description of the Marker Sin demo.
Full code of this demo is available on the [Codesandbox.io](https://codesandbox.io/s/some-charts-marker-sin-demo-vith96?file=/src/app/marker-sin-demo/marker-sin-demo.component.ts)

```javascript
import {Component, OnInit} from '@angular/core';
import {Chart, DataSet, MarkerPlotOptions, PlotKind, Skin} from "some-charts";
import * as Color from "color";
import {XY} from "./model/x-y";

@Component({
  selector: 'marker-sin-demo',
  templateUrl: './marker-sin-demo.component.html'
})
export class MarkerSinDemoComponent implements OnInit {

  ngOnInit(): void {

    let amplitude = 40;
    let frequency = 10;
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

    let requestAnimationFrame = window.requestAnimationFrame;

    let prevTime = 0;

    let updateChartData = function(time: number){

      let timePassed = time - prevTime;

      if(timePassed > 1000 / 60) {

        data.shift()
        data.push(generateSinData(origin, 1)[0]);
        origin++;
        dataSet.update(data);

        prevTime = time;
      }

      requestAnimationFrame(updateChartData);
    }

    updateChartData(prevTime);

    let chart = new Chart<XY, number>(
      "#chart-element",
      dataSet,
      {
        navigation: {
          isFitToViewModeEnabled: true
        },
        header: {
          text: "Sin Plot"
        },
        plots: [
          {
            kind: PlotKind.Marker,
            metric: {
              id: "y",
              caption: "Y",
              color: new Color("#ff392e")
            },
            markerSize: 5
          } as MarkerPlotOptions
        ]
      }
    )
  }
}
```

The code snippet of `marker-sin-demo.component.ts` above starts with import statements that provide needed bindings from  external modules:


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

- function `updateChartData ` implements data update every sevond using generateSinData.

`let chart = new Chart<XY, string>(...);`  calls [Chart constructor](typedoc/classes/Chart.html) to create new Chart for given data, options and attributes:
- `elementSelector`: string `"#chart-element"`
- `dataSet` :DataSet<TItemType, XDimensionType, YDimensionType>, contains data for this chart;
- `options`: ChartOptions - [Chart options](typedoc/interfaces/ChartOptions.html).  
  ChartOptions in this demo contains
- `navigation` object
 ```javascript 
 navigation: {
          isFitToViewModeEnabled: true
        }
```
- `header` - test to be shown on top of Chart ("Sin Plot")

- `plots` - object is array of one object `MarkerPlotOptions` that defines options to fraw boxes.

Object [MarkerPlotOptions](typedoc/classes/MarkerPlotOptionsClass.html) has three properties:

`kind` - defines selected type of drawing (in this example - `PlotKind.Marker`)

`metric` defines Y ????? and color as RGB color value `Color('#ff392e')`(red)

`markerSize` defines size in pixels


The `axes` object defines kind of labels for horizontal axis as text labels  (`AxisTypes.LabeledAxis`) and vertical as axis with numeric labels (`AxisTypes.NumericAxis`)

Playground iframe for this demo is shown on the right pane
```html
<iframe src="https://codesandbox.io/embed/some-charts-marker-sin-demo-vith96?fontsize=14&hidenavigation=1&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Some Charts Marker Sin Demo"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
```
{:.playground title="Marker-Sin Playground"}
