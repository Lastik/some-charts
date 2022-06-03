import {UagentUtils} from "./uagent-utils";
import {NumericPoint} from "../model";


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

  public static clamp(val: number, min: number, max: number) {
    return Math.max(min, Math.min(val, max))
  }

  public static toFixed(num: number, digits: number) {
    return Math.round(num * Math.pow(10, digits)) / Math.pow(10, digits);
  }

  public static floor(number: number, rem: number) {
    if (rem <= 0)
      rem = MathHelper.clamp(-rem, 0, 15);
    let pow = Math.pow(10, rem - 1);
    return pow * Math.floor(number / Math.pow(10, rem - 1));
  }

  public static round(number: number, rem: number) {
    if (rem <= 0) {
      rem = MathHelper.clamp(-rem, 0, 15);
      return MathHelper.toFixed(number, rem);
    }
    let pow = Math.pow(10, rem - 1);
    return pow * Math.round(number / Math.pow(10, rem - 1));
  }

  public static log10(number: number) {
    return Math.log(number) / 2.302585092994046;
  }

  public static logByBase(logarithmBase: number, value: number): number{
    return Math.log(value) / Math.log(logarithmBase);
  }
}
