import {Palette} from "../../plots";
import * as Color from "color";

export interface LegendItem {
  name: string;
  color: Color | Palette;
}
