import {AxisOptions} from "../axis-options";
import {NumericAxisScale} from "./numeric-axis-scale";

export interface NumericAxisOptions extends AxisOptions {
  scale: NumericAxisScale
}
