import * as moment from "moment";
import {MinorTimeUnitTicksGenerator} from "./minor-time-unit-ticks-generator";
import {TimeUnit} from "../../time-unit";

export class MinorYearsTicksGenerator extends MinorTimeUnitTicksGenerator {

  public static readonly TimeUnit: TimeUnit = TimeUnit.Years;

  constructor(majorTickHeight: number) {
    super(majorTickHeight);
  }

  protected getTimeUnitValueAsString(date: moment.Moment): string {
    return date.format('YYYY [y]');
  }

  get timeUnit(): TimeUnit {
    return MinorYearsTicksGenerator.TimeUnit;
  }
}
