import * as moment from "moment";
import {MajorTimeUnitTicksGenerator} from "./major-time-unit-ticks-generator";
import {TimeUnit} from "../../time-unit";

export class MajorMinutesTicksGenerator extends MajorTimeUnitTicksGenerator {

  public static readonly TimeUnit: TimeUnit = TimeUnit.Minutes;

  constructor(majorTickHeight: number) {
    super(majorTickHeight);
  }

  protected getTimeUnitValueAsString(date: moment.Moment): string {
    return date.hours().toString() + 'M';
  }

  get timeUnit(): TimeUnit {
    return MajorMinutesTicksGenerator.TimeUnit;
  }
}
