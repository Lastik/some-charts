import {Palette} from "../plots";
import * as Color from "color";

export interface LegendItem {
  caption: string;
  color: Color | Palette;
}
