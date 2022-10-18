import * as moment from "moment";
import {MajorTimeUnitTicksGenerator} from "./major-time-unit-ticks-generator";
import {TimeUnit} from "../../time-unit";

export class MajorHoursTicksGenerator extends MajorTimeUnitTicksGenerator {

  public static readonly TimeUnit: TimeUnit = TimeUnit.Hours;

  constructor(majorTickHeight: number) {
    super(majorTickHeight);
  }

  protected getTimeUnitValueAsString(date: moment.Moment): string {
    return date.hours().toString() + 'H';
  }

  get timeUnit(): TimeUnit {
    return MajorHoursTicksGenerator.TimeUnit;
  }
}
