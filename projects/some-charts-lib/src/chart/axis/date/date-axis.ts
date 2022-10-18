import {AxisBase} from "../axis-base";
import {
  MajorTicksGenerator,
  MinorTicksGenerator
} from "../ticks";
import {DataTransformation, Range, NumericPoint} from "../../../index";
import {AxisOptions} from "../../../index";
import {AxisOrientation} from "../axis-orientation";
import {MajorDateTicksGenerator} from "../ticks/date/generators/major";
import {MinorDateTicksGenerator} from "../ticks/date/generators/minor";

export class DateAxis extends AxisBase<Date, AxisOptions> {
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
  constructor(location: NumericPoint, orientation: AxisOrientation, range: Range<Date>, dataTransformation: DataTransformation, options: AxisOptions, width?: number, height?: number) {
    super(location, orientation, range, dataTransformation, options, width, height);
  }

  protected createMajorTicksGenerator(): MajorTicksGenerator<Date> {
    return new MajorDateTicksGenerator(this.options?.majorTickHeight!);
  }

  protected createMinorTicksGenerator(): MinorTicksGenerator<Date> | undefined {
    return new MinorDateTicksGenerator(this.options?.minorTickHeight!, this.majorTicksGenerator as MajorDateTicksGenerator)
  }

  axisValueToNumber(tickValue: Date): number {
    return tickValue.getTime();
  }
}
