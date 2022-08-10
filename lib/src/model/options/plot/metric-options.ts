import {Palette} from "../../plots";
import * as Color from "color";

export interface MetricOptions<ColorType extends Color | Palette> {
  name: string;
  caption: string;
  color: ColorType
}
