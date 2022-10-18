import * as moment from "moment";
import {MajorPrimaryTimeUnitTicksGenerator} from "./major-primary-time-unit-ticks-generator";
import {TimeUnit} from "../../time-unit";

export class MajorPrimaryDaysTicksGenerator extends MajorPrimaryTimeUnitTicksGenerator {

  public static readonly TimeUnit: TimeUnit = TimeUnit.Days;

  constructor(majorTickHeight: number) {
    super(majorTickHeight);
  }

  protected getTimeUnitValueAsString(date: moment.Moment): string {
    return date.format('MMMM Do YYYY');
  }

  get timeUnit(): TimeUnit {
    return MajorPrimaryDaysTicksGenerator.TimeUnit;
  }
}
