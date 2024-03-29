import {Component, OnInit} from '@angular/core';
import * as Color from "color";
import {Legend} from "../../../../../some-charts-lib/src";

@Component({
  selector: 'legend-demo',
  templateUrl: './legend-demo.component.html'
})
export class LegendDemoComponent implements OnInit {
  constructor() {
  }

  ngOnInit(): void {
    let legend = new Legend('#chart-element');
    legend.updateContent([
      {caption: 'First', color: "red"},
      {caption: 'Second', color: "green"},
      {caption: 'Second', color: "green"},
      {caption: 'Second', color: "green"},
      {caption: 'Second', color: "green"},
      {caption: 'Second', color: "green"},
      {caption: 'Second', color: "green"},
      {caption: 'Second', color: "green"},
      {caption: 'Second', color: "green"},
      {caption: 'Second', color: "green"},
      {caption: 'Second', color: "green"}
    ])
  }
}
