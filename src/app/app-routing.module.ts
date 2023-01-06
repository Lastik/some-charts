import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChartDemoComponent} from "./chart-demo/chart-demo.component";
import {DateTimeAxisComponent} from "./date-time-axis/date-time-axis.component";
import {BarsDemoComponent} from "./bars-demo/bars-demo.component";
import {BoxDemoComponent} from "./box-demo/box-demo.component";

const routes: Routes = [{
  path: 'chart-demo',
  component: ChartDemoComponent,
}, {
  path: 'date-time-axis',
  component: DateTimeAxisComponent,
}, {
  path: 'bars-demo',
  component: BarsDemoComponent,
}, {
  path: 'box-demo',
  component: BoxDemoComponent,
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
