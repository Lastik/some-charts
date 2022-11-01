/**
 * Chart's plot options
 */
import {PlotKind} from "./plot-kind";

export interface PlotOptions {
  kind: PlotKind;
  animate?: boolean;
  animationDuration?: number;
}
