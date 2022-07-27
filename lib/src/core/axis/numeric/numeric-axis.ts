import {AxisBase} from "../axis-base";
import {
  NumericMajorOrdinaryTicksGenerator,
  NumericMinorTicksGenerator,
  MajorTicksGenerator,
  NumericMajorLogarithmicTicksGenerator,
  MinorTicksGenerator} from "../ticks";
import {DataTransformation, NumericRange, Range, NumericPoint} from "../../../model";
import {AxisOptions, NumericAxisOptions, NumericAxisScaleType, NumericAxisLogarithmicScale} from "../../../model";
import {AxisOrientation} from "../axis-orientation";

export class NumericAxis extends AxisBase<number, NumericAxisOptions> {
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
  constructor(location: NumericPoint, orientation: AxisOrientation, range: NumericRange, dataTransformation: DataTransformation, options: NumericAxisOptions, width?: number, height?: number) {
    super(location, orientation, range, dataTransformation, options, width, height);
  }

  protected createMajorTicksGenerator(): MajorTicksGenerator<number> {
    if (this.options.scale.scaleType == NumericAxisScaleType.Logarithmic) {
      let logScale = this.options.scale as NumericAxisLogarithmicScale;
      return new NumericMajorLogarithmicTicksGenerator(logScale.logarithmBase, this.options?.majorTickHeight!);
    } else {
      return new NumericMajorOrdinaryTicksGenerator(this.options?.majorTickHeight!);
    }
  }

  protected createMinorTicksGenerator(): MinorTicksGenerator<number> | undefined {
    return new NumericMinorTicksGenerator(this.options?.minorTickHeight!);
  }

  axisValueToNumber(tickValue: number): number {
    return tickValue;
  }
}
