import * as moment from "moment";
import {MajorPrimaryTimeUnitTicksGenerator} from "./major-primary-time-unit-ticks-generator";
import {TimeUnit} from "../../time-unit";

export class MajorPrimarySecondsTicksGenerator extends MajorPrimaryTimeUnitTicksGenerator {

  public static readonly TimeUnit: TimeUnit = TimeUnit.Seconds;

  constructor(majorTickHeight: number) {
    super(majorTickHeight);
  }

  protected getTimeUnitValueAsString(date: moment.Moment): string {
    return date.format('MMMM Do YYYY, H:mm:ss');
  }

  get timeUnit(): TimeUnit {
    return MajorPrimarySecondsTicksGenerator.TimeUnit;
  }
}
