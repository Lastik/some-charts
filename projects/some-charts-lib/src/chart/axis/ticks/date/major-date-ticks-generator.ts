import {MajorTicksGenerator} from "../major-ticks-generator";
import {Tick} from "../tick";
import { TimeUnit } from "./time-unit";
import {Range} from "../../../../geometry";

import {
  MajorDaysTicksGenerator,
  MajorHoursTicksGenerator,
  MajorMinutesTicksGenerator,
  MajorMonthsTicksGenerator,
  MajorSecondsTicksGenerator,
  MajorYearsTicksGenerator
} from "./time-period";
import * as moment from "moment";
import {MajorTimeUnitTicksGenerator} from "./major-time-unit-ticks-generator";

export class MajorDateTicksGenerator extends MajorTicksGenerator<Date> {

  private majorSecondsTicksGenerator: MajorSecondsTicksGenerator;
  private majorMinutesTicksGenerator: MajorMinutesTicksGenerator;
  private majorHoursTicksGenerator: MajorHoursTicksGenerator;
  private majorDaysTicksGenerator: MajorDaysTicksGenerator;
  private majorMonthsTicksGenerator: MajorMonthsTicksGenerator;
  private majorYearsTicksGenerator: MajorYearsTicksGenerator;

  constructor(tickHeight: number) {
    super(tickHeight);

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
    let max = moment(range.min);

    if (max.diff(min, TimeUnit.Minutes) < 2) {
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
