import {MajorTicksGenerator, NumericMajorOrdinaryTicksGenerator, Tick} from "../../../index";
import {Range} from "../../../../geometry"
import {TimeUnit} from "./time-unit";

export abstract class MajorTimeUnitTicksGenerator extends MajorTicksGenerator<Date, number> {

  protected ticksCountToTicksValues: Map<number, Array<number>>;

  constructor(majorTickHeight: number) {
    super(majorTickHeight);

    this.ticksCountToTicksValues = this.generateTicksCountToTicksValuesMap();
  }

  abstract get timeUnit(): TimeUnit;

  generateTicks(range: Range<Date>, ticksCount: number): Array<Tick<number>> {
    let numericRange = new Range<number>(
      this.extractTimeUnit(range.min),
      this.extractTimeUnit(range.max)
    );

    return this.generateTicksForNumericRange(numericRange, ticksCount);
  }

  protected abstract generateTicksForNumericRange(numericRange: Range<number>, ticksCount: number): Array<Tick<number>>;

  protected abstract extractTimeUnit(date: Date): number;

  protected abstract generateTicksCountToTicksValuesMap(): Map<number, Array<number>>;
}

