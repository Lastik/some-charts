import {PlotDrawableElement} from "./plot-drawable-element";

export interface PlotElementsUpdate {
  deleted: Array<PlotDrawableElement>;
  updated: Array<PlotDrawableElement>;
  added: Array<PlotDrawableElement>;
}
