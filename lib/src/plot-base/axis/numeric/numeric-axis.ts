import {AxisBase} from "../axis-base";
import {NumericMajorOrdinaryTicksGenerator} from "../ticks/numeric/numeric-major-ordinary-ticks-generator";
import {NumericMinorTicksGenerator} from "../ticks/numeric/numeric-minor-ticks-generator";
import {NumericPoint} from "../../../model/point/numeric-point";
import {AxisOptions, AxisOptionsDefaults} from "../../../options/axes/axis-options";
import {NumericRange} from "../../../model/numeric-range";
import {Range} from "../../../model/range";
import {MinorTicksGenerator} from "../ticks/minor-ticks-generator";
import {MajorTicksGenerator} from "../ticks/major-ticks-generator";
import {DataTransformation} from "../../../model/transformation/data-transformation";
import {NumericAxisOptions} from "../../../options/axes/numeric/numeric-axis-options";
import {NumericAxisScale} from "../../../options/axes/numeric/numeric-axis-scale";
import {NumericMajorLogarithmicTicksGenerator} from "../ticks/numeric/numaric-major-logarithmic-ticks-generator";
import {NumericAxisScaleType} from "../../../options/axes/numeric/numeric-axis-scale-type";
import {NumericAxisLogarithmicScale} from "../../../options/axes/numeric/numeric-axis-logarithmic-scale";

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
