import {Range} from "../../../geometry";
import {Color} from "../../../color";

/**
 * Represents value, which depends on metric value.
 */
export interface MetricDependantValue<OutputType extends Color | number> {
  /**
   * Metric id
   */
  metricId: string;

  /**
   * Range of values
   */
  range: Range<OutputType>;
}
