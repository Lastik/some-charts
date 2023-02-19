---
title: Some Charts
description:  HTML5 canvas js charting library
---

```html
    <iframe src="https://codesandbox.io/embed/some-charts-box-demo-9c3kii?fontsize=14&hidenavigation=1&theme=light"
            style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
            title="Some Charts Box Demo"
            allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
></iframe>
```
{:.playground .playground-pin title="First playground"}


```ts
	@Component({
  selector: 'box-demo',
  templateUrl: './box-demo.component.html'
}) 
```

# Jekyll LibDoc 


## Box Plot demo ##
This file contains short comments to the program code of the Box Plot demo.

Import  statements at the beginning of `box-demo.component.t`s are used to import needed bindings from  external modules:


- Angular/core bindings (`Component`, `OnInit`);
- Box Plot bindings (`AxisTypes`, `BoxOutliersPlotOptions`,  `BoxPlotOptions`,  `Chart`, `DataSet`, `Margin`, `PlotKind`, `Skin`, `Sorting`);

Angular component
   
	@Component({
	selector: 'box-demo',
    templateUrl: './box-demo.component.html'
    }) 

defines ”placeholder” for the demo component on the webpage.

In the Angular `ngOnInit` method implemented needed for the demo objects  creation and initializations:

- `dataSet` defines initial values for displayed data, interfaces and options;
- function `updateDataSet` implements dandomized data update by timer.
- `setTimeout(updateDataSet, 4000)` sets dataset update interval to 4 seconds (4000 milliseconds)

`Chart<XY, string>('#chart-element',...`  defines Chart data, options and attributes:

- navigation object has two properties:
	- `isFitToViewModeEnabled` - ???????
	- `relativePadding` defines margins for the plot area;
-  `header` objects defines text displayed on the top of chart;
- plots object is array of two elements:

	- `BoxPlotOptions` used to set options for displaying boxes and - 
	- `BoxOutliersPlotOptions` used to set options for displaying point that  are out of the box and its «whiskers» areas.

`BoxPlotOptions` has three properties:

- `kind` - defines selected type of drawing (in this example - `PlotKind.Box`)
- `metric` defines Y ????? and color as RGB color value `Color('#F47174')`(light red)
- `animate` defines if smooth drawing update when data has changed is needed

`BoxOutliersPlotOptions` has three properties also:

- `kind` defines selected type of drawing (PlotKind.BoxOutliers);
- `metric` defines Y ????? and RGB drawing color `Color('#66AADE')` (light blue);
- `animate` defines smooth drawing update mode

`axes` object defines kind of labels for horizontal axis as text labels  (`AxisTypes.LabeledAxis`) and vertical as axis with numeric labels (`AxisTypes.NumericAxis`)
