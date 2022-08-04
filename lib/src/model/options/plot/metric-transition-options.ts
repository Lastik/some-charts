import {Range} from "../../range";
import * as Color from "color";

/**
 * Metric transition options to value within range
 */
export interface MetricTransitionOptions<OutputType extends Color | number> {
  /**
   * Metric name
   */
  metricName: string;
  /**
   * Value within range.
   */
  to: Range<OutputType>;
}
