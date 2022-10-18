import * as moment from "moment";
import {MajorSecondaryTimeUnitTicksGenerator} from "./major-secondary-time-unit-ticks-generator";
import {TimeUnit} from "../../time-unit";

export class MajorSecondaryDaysTicksGenerator extends MajorSecondaryTimeUnitTicksGenerator {

  public static readonly TimeUnit: TimeUnit = TimeUnit.Days;

  constructor(majorTickHeight: number) {
    super(majorTickHeight);
  }

  protected getTimeUnitValueAsString(date: moment.Moment): string {
    return date.format('Do');
  }

  get timeUnit(): TimeUnit {
    return MajorSecondaryDaysTicksGenerator.TimeUnit;
  }
}
