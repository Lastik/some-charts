﻿import {UagentUtils} from "./uagent-utils";
import {NumericPoint} from "../geometry";

/**
 * Helps to perform math operations with values.
 */
class MathHelper {

  /**
   * Optimizes point's coordinates for better rendering performance.
   * @param {NumericPoint} point - Point to optimize.
   * @returns {NumericPoint}
   */
  public optimizeNumericPoint(point: NumericPoint): NumericPoint {
    if (UagentUtils.isMsIE) {
      return new NumericPoint(
        this.optimizeValue(point.x),
        this.optimizeValue(point.y));
    } else {
      return point;
    }
  }

  /**
   * Optimizes numeric value for better rendering performance.
   * @param {number} value - Value to optimize.
   * @returns {number}
   */
  public optimizeValue(value: number) {
    if (UagentUtils.isMsIE) {
      return this.truncateValue(value);
    } else {
      return value;
    }
  }

  /**
   * Truncates value's floating part.
   * @param {number} value - Value to truncate.
   * @returns {number}
   */
  private truncateValue(value: number) {
    return (value + .5) | 0
  }

  public toFixed(num: number, digits: number) {
    return Math.round(num * 10 ** digits) / 10 ** digits;
  }

  public log10(number: number) {
    return Math.log(number) / 2.302585092994046;
  }

  public logByBase(logarithmBase: number, value: number): number {
    return Math.log(value) / Math.log(logarithmBase);
  }


  /**
   * find a “nice” number approximately equal to number.
   * @param {number} number - Input number.
   * @param {boolean} round - Round the number if round = true, take ceiling if round = false.
   * @returns {number}
   * */
  public calcNiceNumber(number: number, round: boolean): number {
    const exponent = Math.floor(Math.log10(number));
    const fraction = number / 10 ** exponent;

    let niceFraction: number;

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

    return niceFraction * 10 ** exponent;
  }
}

const mathHelper = new MathHelper();

export {mathHelper as MathHelper};

