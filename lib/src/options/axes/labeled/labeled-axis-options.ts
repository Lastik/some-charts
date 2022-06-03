import {AxisOptions} from "../axis-options";
import {StringPoint} from "../../../model";

export interface LabeledAxisOptions extends AxisOptions {
  labels: Array<StringPoint>;
}
