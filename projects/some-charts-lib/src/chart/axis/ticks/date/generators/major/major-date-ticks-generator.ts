import {Tick} from "../../../tick";
import { TimeUnit } from "../../time-unit";
import {Range} from "../../../../../../geometry";

import * as moment from "moment";
import { MajorSecondsTicksGenerator } from "./major-seconds-ticks-generator";
import { MajorMinutesTicksGenerator } from "./major-minutes-ticks-generator";
import { MajorHoursTicksGenerator } from "./major-hours-ticks-generator";
import { MajorMonthsTicksGenerator } from "./major-months-ticks-generator";
import { MajorDaysTicksGenerator } from "./major-days-ticks-generator";
import {MajorTimeUnitTicksGenerator} from "./major-time-unit-ticks-generator";
import {MajorTicksGenerator} from "../../../major-ticks-generator";
import {MajorYearsTicksGenerator} from "./major-years-ticks-generator";
import {MajorMillisecondsTicksGenerator} from "./major-milliseconds-ticks-generator";

export class MajorDateTicksGenerator extends MajorTicksGenerator<Date> {

  private majorMillisecondsTicksGenerator: MajorMillisecondsTicksGenerator;
  private majorSecondsTicksGenerator: MajorSecondsTicksGenerator;
  private majorMinutesTicksGenerator: MajorMinutesTicksGenerator;
  private majorHoursTicksGenerator: MajorHoursTicksGenerator;
  private majorDaysTicksGenerator: MajorDaysTicksGenerator;
  private majorMonthsTicksGenerator: MajorMonthsTicksGenerator;
  private majorYearsTicksGenerator: MajorYearsTicksGenerator;

  constructor(tickHeight: number) {
    super(tickHeight);

    this.majorMillisecondsTicksGenerator = new MajorMillisecondsTicksGenerator(tickHeight);
    this.majorSecondsTicksGenerator = new MajorSecondsTicksGenerator(tickHeight);
    this.majorMinutesTicksGenerator = new MajorMinutesTicksGenerator(tickHeight);
    this.majorHoursTicksGenerator = new MajorHoursTicksGenerator(tickHeight);
    this.majorDaysTicksGenerator = new MajorDaysTicksGenerator(tickHeight);
    this.majorMonthsTicksGenerator = new MajorMonthsTicksGenerator(tickHeight);
    this.majorYearsTicksGenerator = new MajorYearsTicksGenerator(tickHeight);
  }

  generateTicks(range: Range<Date>, ticksCount: number): Array<Tick<Date>> {
    return this.getSuitableTimeUnitTicksGenerator(range).generateTicks(range, ticksCount);
  }

  getSuitableTimeUnitTicksGenerator(range: Range<Date>): MajorTimeUnitTicksGenerator {

    let min = moment(range.min);
    let max = moment(range.max);

    if (max.diff(min, TimeUnit.Seconds) < 2) {
      return this.majorMillisecondsTicksGenerator;
    } else if (max.diff(min, TimeUnit.Minutes) < 2) {
      return this.majorSecondsTicksGenerator;
    } else if (max.diff(min, TimeUnit.Hours) < 2) {
      return this.majorMinutesTicksGenerator;
    } else if (max.diff(min, TimeUnit.Days) < 2) {
      return this.majorHoursTicksGenerator;
    } else if (max.diff(min, TimeUnit.Months, true) < 1) {
      return this.majorDaysTicksGenerator;
    } else if (max.diff(min, TimeUnit.Years, true) < 2) {
      return this.majorMonthsTicksGenerator;
    } else {
      return this.majorYearsTicksGenerator;
    }
  }
}
