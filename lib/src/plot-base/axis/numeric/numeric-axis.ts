import {AxisBase} from "../axis-base";
import {NumericMajorTicksGenerator} from "../ticks/numeric/numeric-major-ticks-generator";
import {NumericMinorTicksGenerator} from "../ticks/numeric/numeric-minor-ticks-generator";
import {NumericPoint} from "../../../model/point/numeric-point";
import {AxisOptions, AxisOptionsDefaults} from "../../../options/axis-options";
import {NumericRange} from "../../../model/numeric-range";
import {Range} from "../../../model/range";
import {MinorTicksGenerator} from "../ticks/minor-ticks-generator";
import {MajorTicksGenerator} from "../ticks/major-ticks-generator";

export class NumericAxis extends AxisBase<number> {
  /**
   * Creates axis with numbers and ticks on it.
   * @param {NumericPoint} location - Axis location.
   * @param {Range} range - Axis range (it's min and max values)
   * @param {number} width - Axis width.
   * @param {number} height - Axis height.
   * @param {AxisOrientation} orientation - Axis orientation.
   * @param {AxisOptions} options
   */
  constructor(location: NumericPoint, orientation: AxisOrientation, range: NumericRange, width?: number, height?: number, options?: AxisOptions) {
    super(location, orientation, range, width, height, options);
  }

  protected createMajorTicksGenerator(): MajorTicksGenerator<number> {
    return new NumericMajorTicksGenerator(this.options?.majorTickHeight ?? AxisOptionsDefaults.Instance.majorTickHeight);
  }

  protected createMinorTicksGenerator(): MinorTicksGenerator<number> | undefined {
    return new NumericMinorTicksGenerator(this.options?.minorTickHeight ?? AxisOptionsDefaults.Instance.minorTickHeight);
  }

  axisValueToNumber(tickValue: number): number {
    return tickValue;
  }
}
