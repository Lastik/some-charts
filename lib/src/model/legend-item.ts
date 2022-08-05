import {MetricTransitionOptions} from "./options/plot/metric-transition-options";
import * as Color from "color";

export interface LegendItem {
  name: string;
  color: Color | MetricTransitionOptions<Color>;
}
