import {Palette} from "../../plots";
import * as Color from "color";

export interface MetricOptions {
  name: string;
  caption: string;
  color: Color | Palette
}
