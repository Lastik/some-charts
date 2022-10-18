import * as moment from "moment";
import {MinorTimeUnitTicksGenerator} from "./minor-time-unit-ticks-generator";
import {TimeUnit} from "../../time-unit";

export class MinorMinutesTicksGenerator extends MinorTimeUnitTicksGenerator {

  public static readonly TimeUnit: TimeUnit = TimeUnit.Minutes;

  constructor(majorTickHeight: number) {
    super(majorTickHeight);
  }

  protected getTimeUnitValueAsString(date: moment.Moment): string {
    return date.format('MMMM Do YYYY, H:mm');
  }

  get timeUnit(): TimeUnit {
    return MinorMinutesTicksGenerator.TimeUnit;
  }
}
