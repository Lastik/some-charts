/**
 * Chart's plot options
 */
import {PlotKind} from "./plot-kind";

export interface PlotOptions {
  metric: string;
  caption: string;
  color: string;
  kind: PlotKind
}
