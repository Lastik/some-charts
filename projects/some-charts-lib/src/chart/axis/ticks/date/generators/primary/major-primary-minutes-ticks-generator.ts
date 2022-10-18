import * as moment from "moment";
import {MajorPrimaryTimeUnitTicksGenerator} from "./major-primary-time-unit-ticks-generator";
import {TimeUnit} from "../../time-unit";

export class MajorPrimaryMinutesTicksGenerator extends MajorPrimaryTimeUnitTicksGenerator {

  public static readonly TimeUnit: TimeUnit = TimeUnit.Minutes;

  constructor(majorTickHeight: number) {
    super(majorTickHeight);
  }

  protected getTimeUnitValueAsString(date: moment.Moment): string {
    return date.format('MMMM Do YYYY, H:mm');
  }

  get timeUnit(): TimeUnit {
    return MajorPrimaryMinutesTicksGenerator.TimeUnit;
  }
}
