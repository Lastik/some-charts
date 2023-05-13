import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ChartDemoComponent} from "./chart-demo/chart-demo.component";
import {DateTimeAxisComponent} from "./date-time-axis/date-time-axis.component";
import {BarsDemoComponent} from "./bars-demo/bars-demo.component";
import {BoxDemoComponent} from "./box-demo/box-demo.component";
import {MathHelperService} from "./services/math-helper.service";
import {LegendDemoComponent} from "./chart/legend/legend-demo.component";

@NgModule({
  declarations: [
    AppComponent,
    ChartDemoComponent,
    DateTimeAxisComponent,
    BarsDemoComponent,
    BoxDemoComponent,
    LegendDemoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [MathHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
