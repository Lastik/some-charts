import * as moment from "moment";
import {MinorLvl1TimeUnitTicksGenerator} from "./minor-lvl1-time-unit-ticks-generator";
import {TimeUnit} from "../../../time-unit";
import {MinorLvl1DaysTicksGenerator} from "./minor-lvl1-days-ticks-generator";

export class MinorLvl1YearsTicksGenerator extends MinorLvl1TimeUnitTicksGenerator {

  public static readonly TimeUnit: TimeUnit = TimeUnit.Years;

  constructor(majorTickHeight: number) {
    super(majorTickHeight);
  }

  protected getTimeUnitValueAsString(date: moment.Moment): string {
    return date.format('YYYY [y]');
  }

  get timeUnit(): TimeUnit {
    return MinorLvl1YearsTicksGenerator.TimeUnit;
  }
}
