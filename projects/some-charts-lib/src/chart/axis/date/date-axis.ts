import {AxisBase} from "../axis-base";
import {MajorTicksGenerator, MinorTicksGenerator} from "../ticks";
import {AxisOptions, DataTransformation, MathHelper, NumericPoint, Range, Size} from "../../../index";
import {AxisOrientation} from "../axis-orientation";
import {MajorDateTicksGenerator, MinorDateTicksGenerator} from "../ticks/date";
import Konva from "konva";

export class DateAxis extends AxisBase<Date, AxisOptions> {

  protected static readonly paddingBetweenMajorAndMinorTicks = 4;

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

    if(orientation == AxisOrientation.Vertical)
      throw new Error('Vertical Date Axis is not implemented yet');
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

  override updateAxisSize(){
    super.updateAxisSize();

    let renderHeight = this.size.height +
      this.textMeasureUtils!.measureFontHeight(this.options?.font!) + 2 + DateAxis.paddingBetweenMajorAndMinorTicks;
    this._size = new Size(this._size.width, renderHeight);
  }

  protected override renderHorizontalMinorTicks(context: Konva.Context) {
    if (this.minorTicks !== undefined) {
      let minorTicksCount = this.minorTicks?.length ?? 0;
      let minorTicksScreenXCoords = this.minorTicksScreenCoords;

      let minorTicks = this.minorTicks!;
      for (let i = 0; i < minorTicksCount; i++) {
        let tick = minorTicks[i];
        let ticksScreenXCoord = minorTicksScreenXCoords[i]

        let tickLabelSize = this.measureLabelSize(tick.toString());

        let xVal = MathHelper.optimizeValue(this.location.x + ticksScreenXCoord);

        let yVal = MathHelper.optimizeValue(this.location.y +
          DateAxis.paddingBetweenMajorAndMinorTicks + tickLabelSize.height);

        context.fillText(tick.toString(),
          xVal - tickLabelSize.width,
          yVal);
      }
    }
  }
}
