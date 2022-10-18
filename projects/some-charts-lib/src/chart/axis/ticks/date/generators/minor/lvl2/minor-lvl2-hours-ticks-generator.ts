import * as moment from "moment";
import {MinorLvl2TimeUnitTicksGenerator} from "./minor-lvl2-time-unit-ticks-generator";
import {TimeUnit} from "../../../time-unit";
import {MinorLvl2DaysTicksGenerator} from "./minor-lvl2-days-ticks-generator";

export class MinorLvl2HoursTicksGenerator extends MinorLvl2TimeUnitTicksGenerator {

  public static readonly TimeUnit: TimeUnit = TimeUnit.Hours;

  constructor(majorTickHeight: number) {
    super(majorTickHeight);
  }

  protected getTimeUnitValueAsString(date: moment.Moment): string {
    return date.format('MMMM Do YYYY, HH[H]');
  }

  get timeUnit(): TimeUnit {
    return MinorLvl2HoursTicksGenerator.TimeUnit;
  }
}
