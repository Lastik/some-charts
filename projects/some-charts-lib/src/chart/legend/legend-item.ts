import {Palette} from "../plots";
import {Color} from "../../color";

export interface LegendItem {
  caption: string;
  color: Color | Palette;
}
