import * as moment from "moment";
import {MajorSecondaryTimeUnitTicksGenerator} from "./major-secondary-time-unit-ticks-generator";
import {TimeUnit} from "../../time-unit";

export class MajorSecondaryMillisecondsTicksGenerator extends MajorSecondaryTimeUnitTicksGenerator {

  public static readonly TimeUnit: TimeUnit = TimeUnit.Milliseconds;

  constructor(majorTickHeight: number) {
    super(majorTickHeight);
  }

  protected getTimeUnitValueAsString(date: moment.Moment): string {
    return date.milliseconds().toString() + 'ms';
  }

  get timeUnit(): TimeUnit {
    return MajorSecondaryMillisecondsTicksGenerator.TimeUnit;
  }
}
