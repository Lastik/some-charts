/**
 * Chart's plot options
 */
import {PlotKind} from "./plot-kind";

export interface PlotOptions {
  metricName: string;
  caption: string;
  color: string;
  kind: PlotKind
}
