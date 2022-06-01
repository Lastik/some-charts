import {AxisOptions} from "../axis-options";
import {StringPoint} from "../../../model/point/string-point";

export interface LabeledAxisOptions extends AxisOptions {
  labels: Array<StringPoint>;
}
