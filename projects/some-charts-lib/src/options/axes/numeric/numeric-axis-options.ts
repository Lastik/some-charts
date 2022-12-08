import {AxisMajorOptions, AxisOptions} from "../axis-options";
import {NumericAxisScale} from "./numeric-axis-scale";

export interface NumericAxisMajorOptions extends AxisMajorOptions {
  scale: NumericAxisScale
}

export interface NumericAxisOptions extends AxisOptions, NumericAxisMajorOptions {

}
