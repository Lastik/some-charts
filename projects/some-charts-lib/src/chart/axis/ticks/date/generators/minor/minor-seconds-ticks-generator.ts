import * as moment from "moment";
import {MinorTimeUnitTicksGenerator} from "./minor-time-unit-ticks-generator";
import {TimeUnit} from "../../time-unit";

export class MinorSecondsTicksGenerator extends MinorTimeUnitTicksGenerator {

  public static readonly TimeUnit: TimeUnit = TimeUnit.Seconds;

  constructor(majorTickHeight: number) {
    super(majorTickHeight);
  }

  protected getTimeUnitValueAsString(date: moment.Moment): string {
    return date.format('HH:mm:ss');
  }

  get timeUnit(): TimeUnit {
    return MinorSecondsTicksGenerator.TimeUnit;
  }
}
