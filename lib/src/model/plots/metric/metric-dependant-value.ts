import {Range} from "../../geometry/range";
import * as Color from "color";

/**
 * Represents value, which depends on metric value.
 */
export interface MetricDependantValue<OutputType extends Color | number> {
  /**
   * Metric name
   */
  metricName: string;

  /**
   * Range of values
   */
  range: Range<OutputType>;
}
