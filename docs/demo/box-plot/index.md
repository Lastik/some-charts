---
layout: libdoc/page-split
unlisted: false
title: Box Plot
category: Demos
---

## Box-Plot demo

This page contains description of the Box Plot demo code.
Full documentation is available on the [Codesandbox.io](https://codesandbox.io/s/some-charts-box-demo-9c3kii?from-embed)

```javascript
import { Component, OnInit } from '@angular/core';
import {
    AxisTypes,
    BoxOutliersPlotOptions,
    BoxPlotOptions,
    Chart,
    DataSet,
    Margin,
    PlotKind,
    Skin,
    Sorting
} from 'some-charts';
import * as Color from 'color';
import { XY } from './model/x-y';

@Component({
    selector: 'box-demo',
    templateUrl: './box-demo.component.html'
})
export class BoxDemoComponent implements OnInit {
    ngOnInit(): void {
        let self = this;

        let dataSet = new DataSet<XY, string>(
            [{
                x: 'first',
                y: [650, 540, 700, 807, 730, 650, 740, 780, 780, 680, 800, 780, 720, 450, 560, 610, 800, 850],
              }, {
                x: 'second',
                y: [740, 740, 740, 740, 680, 640, 640, 680, 700, 640, 620, 590, 620, 680, 680, 650, 600, 580]
              }, {
                x: 'third',
                y: [610, 680, 660, 660, 520, 540, 410, 660, 770, 750, 660, 710, 630, 670, 640, 640, 650, 630],
              }, {
                x: 'fourth',
                y: [10, 640, 610, 620, 600, 570, 560, 540, 550, 560, 710, 720, 690, 660, 640, 520, 640, 610],
              }],
            {
                y: {
                    func: (item) => {
                        return item.y;
                    },
                    isArrayLike: true
                }
            },
            (item) => {
                return item.x;
            },
            undefined,
            Sorting.None
        );

        function updateDataSet() {
            dataSet.update([{
                x: 'first',
                y: [650, 540, 700, 807, 730,
                  self.getRandomInt(450, 700), 740,
                  self.getRandomInt(450, 800), 780,
                  self.getRandomInt(450, 800), 800, 780, 720, 450, 560, 610, 800, 850],
              }, {
                x: 'second',
                y: [740, 740, 740, 740,
                  self.getRandomInt(450, 700), 640, 640, 680,
                  self.getRandomInt(450, 700), 640, 620, 590,
                  self.getRandomInt(450, 700), 680, 680, 650, 600, 580]
              }, {
                x: 'third',
                y: [610, 680, 660, 660, 520, 540, 410, 660, 770, 750, 660, 710, 630, 670, 640, 640, 650, 630],
              }, {
                x: 'fourth',
                y: [self.getRandomInt(5, 200), 640, 610,
                  self.getRandomInt(350, 600), 600, 570,
                  self.getRandomInt(350, 600), 540,
                  self.getRandomInt(350, 600), 560, 710, 720,
                  self.getRandomInt(350, 700), 660, 640, 520, 640, 610],
              }]);

            setTimeout(updateDataSet, 4000);
        }

        setTimeout(updateDataSet, 4000);

        new Chart<XY, string>('#chart-element', dataSet, {
            navigation: {
                isFitToViewModeEnabled: true,
                relativePadding: new Margin(0, 0.1, 0, 0.1)
            },
            header: {
                text: 'Box chart'
            },
            plots: [
                {
                    kind: PlotKind.Box,
                    metric: {
                        id: 'y',
                        caption: 'Y',
                        color: new Color('#F47174')
                    },
                    animate: true
                } as BoxPlotOptions,
                {
                    kind: PlotKind.BoxOutliers,
                    metric: {
                        id: 'y',
                        caption: 'Y',
                        color: new Color('#66AADE')
                    },
                    animate: true
                } as BoxOutliersPlotOptions
            ],
            axes: {
                horizontal: {
                    axisType: AxisTypes.LabeledAxis
                },
                vertical: {
                    axisType: AxisTypes.NumericAxis
                }
            }
        });
    }

    getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
```

The code snippet of `box-demo.component.ts` above starts with import statements that provide needed bindings from  external modules:


- Angular/core bindings (`Component`, `OnInit`);
- some-charts bindings (`AxisTypes`, `BoxOutliersPlotOptions`,  `BoxPlotOptions`,  `Chart`, `DataSet`, `Margin`, `PlotKind`, `Skin`, `Sorting`);

Angular component
 ```javascript  
	@Component({
	selector: 'box-demo',
    templateUrl: './box-demo.component.html'
    }) ...
```
defines ”placeholder” for the demo component on the webpage.

In the Angular `ngOnInit` method implements creation and initializations needed for the demo objects:

- `dataSet` defines initial values for displayed data, interfaces and options;
- function `updateDataSet` implements randomized data update by timer.
- `setTimeout(updateDataSet, 4000)` sets dataset update interval to 4 seconds (4000 milliseconds)

`new Chart<XY, Date>('#chart-element',...)`  creates chart for given data, options and attributes using [Chart constructor](typedoc/classes/Chart.html) with needed parameters:
- `elementSelector`: string `"#chart-element"`
- `dataSet` :DataSet<TItemType, XDimensionType, YDimensionType>, contains data for this chart;
- `options`: ChartOptions - [Chart options](typedoc/interfaces/ChartOptions.html).

ChartOptions in this demo contains:
- navigation object
 ```javascript 
 navigation: {
                isFitToViewModeEnabled: true,
                relativePadding: new Margin(0, 0.1, 0, 0.1)
            },
```
has two properties 	`isFitToViewModeEnabled` that enables .... and `relativePadding` that defines margins for the plot area;

- `header` objects defines text displayed on the top of chart;
- plots object is array of two elements:

  `BoxPlotOptions` used to set options for displaying boxes and

  `BoxOutliersPlotOptions` used to set options for displaying point that  are out of the box and its «whiskers» areas.

The `BoxPlotOptions` has three properties:

`kind` - defines selected type of drawing (in this example - `PlotKind.Box`)

`metric` defines Y ????? and color as RGB color value `Color('#F47174')`(light red)

`animate` defines if smooth drawing update when data has changed is needed


The `BoxOutliersPlotOptions` object has three properties also:

`kind` defines selected type of drawing (PlotKind.BoxOutliers);

`metric` defines Y ????? and RGB drawing color `Color('#66AADE')` (light blue);

`animate` defines smooth drawing update mode


The `axes` object defines kind of labels for horizontal axis as text labels  (`AxisTypes.LabeledAxis`) and vertical as axis with numeric labels (`AxisTypes.NumericAxis`)

Playground iframe for this demo is shown on the right pane.
```html
<iframe src="https://codesandbox.io/embed/some-charts-box-demo-9c3kii?fontsize=14&amp;hidenavigation=1&amp;theme=light" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" title="Some Charts Box Demo" allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>
```
{:.playground title="Box-Plot Playground"}
