import * as moment from "moment";
import {MajorSecondaryTimeUnitTicksGenerator} from "./major-secondary-time-unit-ticks-generator";
import {TimeUnit} from "../../time-unit";

export class MajorSecondaryHoursTicksGenerator extends MajorSecondaryTimeUnitTicksGenerator {

  public static readonly TimeUnit: TimeUnit = TimeUnit.Hours;

  constructor(majorTickHeight: number) {
    super(majorTickHeight);
  }

  protected getTimeUnitValueAsString(date: moment.Moment): string {
    return date.hours().toString() + 'H';
  }

  get timeUnit(): TimeUnit {
    return MajorSecondaryHoursTicksGenerator.TimeUnit;
  }
}
