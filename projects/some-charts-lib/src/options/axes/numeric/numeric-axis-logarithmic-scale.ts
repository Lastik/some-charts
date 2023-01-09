import {NumericAxisScale} from "./numeric-axis-scale";

export interface NumericAxisLogarithmicScale extends NumericAxisScale {
  /**
   * Base value for logarithmic axis.
   * */
  logarithmBase: number;
}
