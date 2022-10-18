import * as moment from "moment";
import {MajorSecondaryTimeUnitTicksGenerator} from "./major-secondary-time-unit-ticks-generator";
import {TimeUnit} from "../../time-unit";

export class MajorSecondarySecondsTicksGenerator extends MajorSecondaryTimeUnitTicksGenerator {

  public static readonly TimeUnit: TimeUnit = TimeUnit.Seconds;

  constructor(majorTickHeight: number) {
    super(majorTickHeight);
  }

  protected getTimeUnitValueAsString(date: moment.Moment): string {
    return date.seconds().toString() + 's';
  }

  get timeUnit(): TimeUnit {
    return MajorSecondarySecondsTicksGenerator.TimeUnit;
  }
}
