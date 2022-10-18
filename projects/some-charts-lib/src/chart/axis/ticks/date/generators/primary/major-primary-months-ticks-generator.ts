import * as moment from "moment";
import {MajorPrimaryTimeUnitTicksGenerator} from "./major-primary-time-unit-ticks-generator";
import {TimeUnit} from "../../time-unit";

export class MajorPrimaryMonthsTicksGenerator extends MajorPrimaryTimeUnitTicksGenerator {

  public static readonly TimeUnit: TimeUnit = TimeUnit.Months;

  constructor(majorTickHeight: number) {
    super(majorTickHeight);
  }

  protected getTimeUnitValueAsString(date: moment.Moment): string {
    return date.format('MMMM YYYY');
  }

  get timeUnit(): TimeUnit {
    return MajorPrimaryMonthsTicksGenerator.TimeUnit;
  }
}
