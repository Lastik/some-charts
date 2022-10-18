import * as moment from "moment";
import {TimeUnit} from "../../time-unit";
import {MajorSecondaryTimeUnitTicksGenerator} from "./major-secondary-time-unit-ticks-generator";

export class MajorSecondaryYearsTicksGenerator extends MajorSecondaryTimeUnitTicksGenerator {

  public static readonly TimeUnit: TimeUnit = TimeUnit.Years;

  constructor(majorTickHeight: number) {
    super(majorTickHeight);
  }

  protected getTimeUnitValueAsString(date: moment.Moment): string {
    return date.format('YYYY [y]');
  }

  get timeUnit(): TimeUnit {
    return MajorSecondaryYearsTicksGenerator.TimeUnit;
  }
}
