---
layout: libdoc/page-split
unlisted: false
title: Box Plot
category: Demos
---

See the code below for a simple example of Bars Plot visualization.
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

Please take a look into the Angular `ngOnInit` method, where we create and initialize all the stuff:

- `dataSet` defines initial state of a single-dimensional `DataSet` with a dimension **x** (with string values) and an array metric **y** defined on that dimension;
- function `updateDataSet` implements randomized data update by timer.

Constructor `new Chart<XY, Date>('#chart-element',...)`  creates chart for a given data and provided options and attributes by calling [Chart constructor](typedoc/classes/Chart.html) with the following set of parameters:
- `elementSelector`: string `"#chart-element"`, which specifies selector to an HTML element where chart should be rendered
- `dataSet` :DataSet<TItemType, XDimensionType, YDimensionType> specified data set for this chart;
- `options`: Options object which specifies how to render this chart in a declarative way (see [Chart options](typedoc/interfaces/ChartOptions.html)).

`ChartOptions` for this demo is initialized with the following set of attributes:

- `navigation` object with the following attributes:
  - `isFitToViewModeEnabled` which specifies that all the chart data must be fitted vertically and horizontally within the chart viewport
  - `relativePadding` which specifies additional padding applied from chart grid to chart data. This padding is specified in relative units.

- `header` objects defines text displayed on top of the chart;
- An array of plots to display on this chart. For this demo, we render a `Box` plot with `Outliers` which visualize points that are out of the box and its "whiskers" areas. So we need to create a new `BoxPlotOptions` object, which specifies options for the Box plot, and a new `BoxOutliersPlotOptions` object which specifies options for the Box Outliers plot.

The `BoxPlotOptions` has three properties:

- `kind` - defines kind of a plot to draw (in this demo - `PlotKind.Box`)

- `metric` - a metric for the plot. For Box plot, each metric value should be an array of numeric values representing all the data gathered for the corresponding dimension.
  - `id` specifies metric id in the Data Set
  - `caption` specifies metric caption in legend and in other places.
  - `color` specifies metric color, when it's been visualized on a plot.

- `animate` specifies if transitions of data in the `DataSet` between updates should be animated


The `BoxOutliersPlotOptions` object has three properties also:

- `kind` - defines kind of a plot to draw (in this demo - `PlotKind.BoxOutliers`)

- `metric` - a metric for for the plot. For Outlier plot, each metric value should be an array of numeric values representing all the data gathered for the corresponding dimension.
  - `id` specifies metric id in the Data Set
  - `caption` specifies metric caption in legend and in other places.
  - `color` specifies metric color, when it's been visualized on a plot.

- `animate` specifies if transitions of data in the `DataSet` between updates should be animated


The `axes` object defines types of axes to use for a horizontal and vertical axes. In this Demo, we use Labeled horizontal ( we use `AxisTypes.LabeledAxis`) and numeric vertical (we use `AxisTypes.NumericAxis`) axes.

Playground iframe for this demo is shown on the right pane.
```html
<iframe src="https://codesandbox.io/embed/some-charts-box-demo-9c3kii?fontsize=14&amp;hidenavigation=1&amp;theme=light" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" title="Some Charts Box Demo" allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking" sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"></iframe>
```
{:.playground title="Box-Plot Playground"}
