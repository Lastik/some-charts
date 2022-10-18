import {MajorTicksGenerator, Tick} from "../../../../../index";
import {Range} from "../../../../../../geometry";
import {TimeUnit} from "../../time-unit";
import * as moment from "moment";

export abstract class MajorPrimaryTimeUnitTicksGenerator extends MajorTicksGenerator<Date> {

  constructor(tickHeight: number) {
    super(tickHeight);
  }

  abstract get timeUnit(): TimeUnit;

  generateTicks(range: Range<Date>, ticksCount: number): Array<Tick<Date>> {

  }

  protected abstract getTimeUnitValueAsString(date: moment.Moment): string;

  override suggestIncreasedTicksCount(ticksCount: number): number {
    return ticksCount;
  }

  override suggestDecreasedTickCount(ticksCount: number): number {
    return ticksCount;
  }
}
