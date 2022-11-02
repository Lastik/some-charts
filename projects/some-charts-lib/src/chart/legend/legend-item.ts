import {Palette} from "../plots";
import * as Color from "color";

export interface LegendItem {
  id: string;
  color: Color | Palette;
}
