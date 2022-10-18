import * as moment from "moment";
import {MajorTimeUnitTicksGenerator} from "../major-time-unit-ticks-generator";
import {TimeUnit} from "../time-unit";

export class MajorMillisecondsTicksGenerator extends MajorTimeUnitTicksGenerator {

  public static readonly TimeUnit: TimeUnit = TimeUnit.Milliseconds;

  constructor(majorTickHeight: number) {
    super(majorTickHeight);
  }

  protected getTimeUnitValueAsString(date: moment.Moment): string {
    return date.milliseconds().toString() + 'ms';
  }

  get timeUnit(): TimeUnit {
    return MajorMillisecondsTicksGenerator.TimeUnit;
  }
}
