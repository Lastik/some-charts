﻿import {AxisBase} from "../axis-base";
import {NumericPoint} from "../../../model/point/numeric-point";
import {AxisOptions, AxisOptionsDefaults} from "../../../options/axes/axis-options";
import {NumericRange} from "../../../model/numeric-range";
import {Range} from "../../../model/range";
import {MinorTicksGenerator} from "../ticks/minor-ticks-generator";
import {MajorTicksGenerator} from "../ticks/major-ticks-generator";
import {LabeledMajorTicksGenerator} from "../ticks/labeled/labeled-major-ticks-generator";
import {StringPoint} from "../../../model/point/string-point";
import {DataTransformation} from "../../../model/transformation/data-transformation";

export class LabeledAxis extends AxisBase<number> {

  private labels: Array<StringPoint>;

  /**
   * Creates axis with string labels on it.
   * @param {NumericPoint} location - Axis location.
   * @param {Range} range - Axis range (it's min and max values)
   * @param {DataTransformation} dataTransformation - transformation of data from data coordinates to screen coordinate and vice versa.
   * @param {Array<StringPoint>} labels - Axis labels.
   * @param {number} width - Axis width.
   * @param {number} height - Axis height.
   * @param {AxisOrientation} orientation - Axis orientation.
   * @param {AxisOptions} options
   */
  constructor(location: NumericPoint, orientation: AxisOrientation, range: NumericRange, dataTransformation: DataTransformation, labels: Array<StringPoint>, width?: number, height?: number, options?: AxisOptions) {
    super(location, orientation, range, dataTransformation, width, height, options);
    this.labels = labels;
  }

  protected createMajorTicksGenerator(): MajorTicksGenerator<number> {
    return new LabeledMajorTicksGenerator(this.options?.majorTickHeight ?? AxisOptionsDefaults.Instance.majorTickHeight, this.labels);
  }

  protected createMinorTicksGenerator(): MinorTicksGenerator<number> | undefined {
    return undefined
  }

  axisValueToNumber(tickValue: number): number {
    return tickValue;
  }
}
