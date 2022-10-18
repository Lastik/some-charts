import * as moment from "moment";
import {MajorTimeUnitTicksGenerator} from "./major-time-unit-ticks-generator";
import {TimeUnit} from "../../time-unit";

export class MajorSecondsTicksGenerator extends MajorTimeUnitTicksGenerator {

  public static readonly TimeUnit: TimeUnit = TimeUnit.Seconds;

  constructor(majorTickHeight: number) {
    super(majorTickHeight);
  }

  protected getTimeUnitValueAsString(date: moment.Moment): string {
    return date.seconds().toString() + 's';
  }

  get timeUnit(): TimeUnit {
    return MajorSecondsTicksGenerator.TimeUnit;
  }
}
