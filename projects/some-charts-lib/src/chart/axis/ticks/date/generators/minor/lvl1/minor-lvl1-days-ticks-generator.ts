import * as moment from "moment";
import {MinorLvl1TimeUnitTicksGenerator} from "./minor-lvl1-time-unit-ticks-generator";
import {TimeUnit} from "../../../time-unit";

export class MinorLvl1DaysTicksGenerator extends MinorLvl1TimeUnitTicksGenerator {

  public static readonly TimeUnit: TimeUnit = TimeUnit.Days;

  constructor(majorTickHeight: number) {
    super(majorTickHeight);
  }

  protected getTimeUnitValueAsString(date: moment.Moment): string {
    return date.format('Do');
  }

  get timeUnit(): TimeUnit {
    return MinorLvl1DaysTicksGenerator.TimeUnit;
  }
}
