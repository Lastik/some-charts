import {Palette} from "../../chart/plots";
import * as Color from "color";

export interface MetricOptions<ColorType extends Color | Palette> {
  id: string;
  caption: string;
  color: ColorType
}
