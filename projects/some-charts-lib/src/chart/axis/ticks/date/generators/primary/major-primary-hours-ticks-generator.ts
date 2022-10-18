import * as moment from "moment";
import {MajorPrimaryTimeUnitTicksGenerator} from "./major-primary-time-unit-ticks-generator";
import {TimeUnit} from "../../time-unit";

export class MajorPrimaryHoursTicksGenerator extends MajorPrimaryTimeUnitTicksGenerator {

  public static readonly TimeUnit: TimeUnit = TimeUnit.Hours;

  constructor(majorTickHeight: number) {
    super(majorTickHeight);
  }

  protected getTimeUnitValueAsString(date: moment.Moment): string {
    return date.format('MMMM Do YYYY, H[H]');
  }

  get timeUnit(): TimeUnit {
    return MajorPrimaryHoursTicksGenerator.TimeUnit;
  }
}
