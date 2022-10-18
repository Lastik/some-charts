import * as moment from "moment";
import {MajorTimeUnitTicksGenerator} from "../major-time-unit-ticks-generator";
import {TimeUnit} from "../time-unit";

export class MajorYearsTicksGenerator extends MajorTimeUnitTicksGenerator {

  public static readonly TimeUnit: TimeUnit = TimeUnit.Years;

  constructor(majorTickHeight: number) {
    super(majorTickHeight);
  }

  protected getTimeUnitValueAsString(date: moment.Moment): string {
    return date.format('YYYY');
  }

  get timeUnit(): TimeUnit {
    return MajorYearsTicksGenerator.TimeUnit;
  }
}
