import * as moment from "moment";
import {MinorLvl2TimeUnitTicksGenerator} from "./minor-lvl2-time-unit-ticks-generator";
import {TimeUnit} from "../../../time-unit";
import {MinorLvl2DaysTicksGenerator} from "./minor-lvl2-days-ticks-generator";

export class MinorLvl2MinutesTicksGenerator extends MinorLvl2TimeUnitTicksGenerator {

  public static readonly TimeUnit: TimeUnit = TimeUnit.Minutes;

  constructor(majorTickHeight: number) {
    super(majorTickHeight);
  }

  protected getTimeUnitValueAsString(date: moment.Moment): string {
    return date.format('MMMM Do YYYY, HH:mm');
  }

  get timeUnit(): TimeUnit {
    return MinorLvl2MinutesTicksGenerator.TimeUnit;
  }
}
