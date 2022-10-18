import * as moment from "moment";
import {MajorSecondaryTimeUnitTicksGenerator} from "./major-secondary-time-unit-ticks-generator";
import {TimeUnit} from "../../time-unit";

export class MajorSecondaryMonthsTicksGenerator extends MajorSecondaryTimeUnitTicksGenerator {

  public static readonly TimeUnit: TimeUnit = TimeUnit.Months;

  constructor(majorTickHeight: number) {
    super(majorTickHeight);
  }

  protected getTimeUnitValueAsString(date: moment.Moment): string {
    return date.format('MMM');
  }

  get timeUnit(): TimeUnit {
    return MajorSecondaryMonthsTicksGenerator.TimeUnit;
  }
}
