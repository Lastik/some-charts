import * as moment from "moment";
import {MajorTimeUnitTicksGenerator} from "../major-time-unit-ticks-generator";
import {TimeUnit} from "../time-unit";

export class MajorMonthsTicksGenerator extends MajorTimeUnitTicksGenerator {

  public static readonly TimeUnit: TimeUnit = TimeUnit.Months;

  constructor(majorTickHeight: number, detailed: boolean) {
    super(majorTickHeight, detailed);
  }

  protected getTimeUnitValueAsString(date: moment.Moment, detailed: boolean): string {
    if (detailed) {
      return date.format('MMMM');
    }
    return date.format('MMM');
  }

  get timeUnit(): TimeUnit {
    return MajorMonthsTicksGenerator.TimeUnit;
  }
}
