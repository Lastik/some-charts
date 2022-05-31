﻿import {AxisBase} from "../axis-base";
import {NumericMajorOrdinaryTicksGenerator} from "../ticks/numeric/numeric-major-ordinary-ticks-generator";
import {NumericMinorTicksGenerator} from "../ticks/numeric/numeric-minor-ticks-generator";
import {NumericPoint} from "../../../model/point/numeric-point";
import {AxisOptions, AxisOptionsDefaults} from "../../../options/axes/axis-options";
import {NumericRange} from "../../../model/numeric-range";
import {Range} from "../../../model/range";
import {MinorTicksGenerator} from "../ticks/minor-ticks-generator";
import {MajorTicksGenerator} from "../ticks/major-ticks-generator";
import {DataTransformation} from "../../../model/transformation/data-transformation";

export class NumericAxis extends AxisBase<number> {
  /**
   * Creates axis with numbers and ticks on it.
   * @param {NumericPoint} location - Axis location.
   * @param {Range} range - Axis range (it's min and max values)
   * @param {DataTransformation} dataTransformation - transformation of data from data coordinates to screen coordinate and vice versa.
   * @param {number} width - Axis width.
   * @param {number} height - Axis height.
   * @param {AxisOrientation} orientation - Axis orientation.
   * @param {AxisOptions} options
   */
  constructor(location: NumericPoint, orientation: AxisOrientation, range: NumericRange, dataTransformation: DataTransformation, width?: number, height?: number, options?: AxisOptions) {
    super(location, orientation, range, dataTransformation, width, height, options);
  }

  protected createMajorTicksGenerator(): MajorTicksGenerator<number> {
    return new NumericMajorOrdinaryTicksGenerator(this.options?.majorTickHeight ?? AxisOptionsDefaults.Instance.majorTickHeight);
  }

  protected createMinorTicksGenerator(): MinorTicksGenerator<number> | undefined {
    return new NumericMinorTicksGenerator(this.options?.minorTickHeight ?? AxisOptionsDefaults.Instance.minorTickHeight);
  }

  axisValueToNumber(tickValue: number): number {
    return tickValue;
  }
}
