import * as moment from "moment";
import {MinorTimeUnitTicksGenerator} from "./minor-time-unit-ticks-generator";
import {TimeUnit} from "../../time-unit";

export class MinorMonthsTicksGenerator extends MinorTimeUnitTicksGenerator {

  public static readonly TimeUnit: TimeUnit = TimeUnit.Months;

  constructor(majorTickHeight: number) {
    super(majorTickHeight);
  }

  protected getTimeUnitValueAsString(date: moment.Moment): string {
    return date.format('MMMM YYYY');
  }

  get timeUnit(): TimeUnit {
    return MinorMonthsTicksGenerator.TimeUnit;
  }
}
