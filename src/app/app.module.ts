import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ChartDemoComponent} from "./chart-demo/chart-demo.component";
import {DateTimeAxisComponent} from "./date-time-axis/date-time-axis.component";
import {BarsDemoComponent} from "./bars-demo/bars-demo.component";
import {BoxDemoComponent} from "./box-demo/box-demo.component";

@NgModule({
  declarations: [
    AppComponent,
    ChartDemoComponent,
    DateTimeAxisComponent,
    BarsDemoComponent,
    BoxDemoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
