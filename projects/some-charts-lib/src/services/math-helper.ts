import {UagentUtils} from "./uagent-utils";
import {NumericPoint} from "../geometry";


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
    } else {
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
    } else {
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

  public static toFixed(num: number, digits: number) {
    return Math.round(num * Math.pow(10, digits)) / Math.pow(10, digits);
  }

  public static log10(number: number) {
    return Math.log(number) / 2.302585092994046;
  }

  public static logByBase(logarithmBase: number, value: number): number {
    return Math.log(value) / Math.log(logarithmBase);
  }


  public static calcNiceNumber(number: number, round: boolean) {
    let exponent = Math.floor(Math.log10(number));
    let fraction = number / Math.pow(10, exponent);

    let niceFraction: number | undefined = undefined;

    if (round) {
      if (fraction < 1.5)
        niceFraction = 1;
      else if (fraction < 3)
        niceFraction = 2;
      else if (fraction < 7)
        niceFraction = 5;
      else
        niceFraction = 10;
    } else {
      if (fraction <= 1)
        niceFraction = 1;
      else if (fraction <= 2)
        niceFraction = 2;
      else if (fraction <= 5)
        niceFraction = 5;
      else
        niceFraction = 10;
    }

    return niceFraction * Math.pow(10, exponent);
  }
}
