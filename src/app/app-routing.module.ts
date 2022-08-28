import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChartDemoComponent} from "./chart-demo/chart-demo.component";

const routes: Routes = [{
  path: 'chart-demo',
  component: ChartDemoComponent,
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
