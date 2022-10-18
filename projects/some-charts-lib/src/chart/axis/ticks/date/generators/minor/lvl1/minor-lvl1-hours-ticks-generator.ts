import * as moment from "moment";
import {MinorLvl1TimeUnitTicksGenerator} from "./minor-lvl1-time-unit-ticks-generator";
import {TimeUnit} from "../../../time-unit";
import {MinorLvl1DaysTicksGenerator} from "./minor-lvl1-days-ticks-generator";

export class MinorLvl1HoursTicksGenerator extends MinorLvl1TimeUnitTicksGenerator {

  public static readonly TimeUnit: TimeUnit = TimeUnit.Hours;

  constructor(majorTickHeight: number) {
    super(majorTickHeight);
  }

  protected getTimeUnitValueAsString(date: moment.Moment): string {
    return date.format('HH:00');
  }

  get timeUnit(): TimeUnit {
    return MinorLvl1HoursTicksGenerator.TimeUnit;
  }
}
