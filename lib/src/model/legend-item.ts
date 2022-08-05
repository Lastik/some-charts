import {Palette} from "./plots/metric/palette";
import * as Color from "color";

export interface LegendItem {
  name: string;
  color: Color | Palette;
}
