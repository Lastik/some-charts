import * as moment from "moment";
import {MinorLvl2TimeUnitTicksGenerator} from "./minor-lvl2-time-unit-ticks-generator";
import {TimeUnit} from "../../../time-unit";

export class MinorLvl2DaysTicksGenerator extends MinorLvl2TimeUnitTicksGenerator {

  public static readonly TimeUnit: TimeUnit = TimeUnit.Days;

  constructor(majorTickHeight: number) {
    super(majorTickHeight);
  }

  protected getTimeUnitValueAsString(date: moment.Moment): string {
    return date.format('MMMM Do YYYY');
  }

  get timeUnit(): TimeUnit {
    return MinorLvl2DaysTicksGenerator.TimeUnit;
  }
}
