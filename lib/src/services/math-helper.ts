import {UagentUtils} from "./uagent-utils";
import {NumericPoint} from "../model/point/numeric-point";


/**
 * Helps to perform math operations with values.
 */
export class MathHelper {

  /**
   * Optimizes point's coordinates for better rendering performance.
   * @param {NumericPoint} point - Point to optimize.
   * @returns {NumericPoint}
   */
  public static optimizeNumericPoint(point: NumericPoint): NumericPoint {
    if (UagentUtils.isMsIE) {
      return new NumericPoint(
        MathHelper.optimizeValue(point.x),
        MathHelper.optimizeValue(point.y));
    }
    else {
      return point;
    }
  }

  /**
   * Optimizes numeric value for better rendering performance.
   * @param {number} value - Value to optimize.
   * @returns {number}
   */
  public static optimizeValue(value: number) {
    if (UagentUtils.isMsIE) {
      return MathHelper.truncateValue(value);
    }
    else {
      return value;
    }
  }

  /**
   * Truncates value's floating part.
   * @param {number} value - Value to truncate.
   * @returns {number}
   */
  private static truncateValue(value: number) {
    return (value + .5) | 0
  }
}
