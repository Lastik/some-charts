import * as moment from "moment";
import {MinorTimeUnitTicksGenerator} from "./minor-time-unit-ticks-generator";
import {TimeUnit} from "../../time-unit";

export class MinorHoursTicksGenerator extends MinorTimeUnitTicksGenerator {

  public static readonly TimeUnit: TimeUnit = TimeUnit.Hours;

  constructor(majorTickHeight: number) {
    super(majorTickHeight);
  }

  protected getTimeUnitValueAsString(date: moment.Moment): string {
    return date.format('MMMM Do YYYY, H[H]');
  }

  get timeUnit(): TimeUnit {
    return MinorHoursTicksGenerator.TimeUnit;
  }
}
