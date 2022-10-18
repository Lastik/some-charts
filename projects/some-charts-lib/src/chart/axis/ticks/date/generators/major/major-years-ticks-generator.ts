import * as moment from "moment";
import {TimeUnit} from "../../time-unit";
import {MajorTimeUnitTicksGenerator} from "./major-time-unit-ticks-generator";

export class MajorYearsTicksGenerator extends MajorTimeUnitTicksGenerator {

  public static readonly TimeUnit: TimeUnit = TimeUnit.Years;

  constructor(majorTickHeight: number) {
    super(majorTickHeight);
  }

  protected getTimeUnitValueAsString(date: moment.Moment): string {
    return date.format('YYYY [y]');
  }

  get timeUnit(): TimeUnit {
    return MajorYearsTicksGenerator.TimeUnit;
  }
}
