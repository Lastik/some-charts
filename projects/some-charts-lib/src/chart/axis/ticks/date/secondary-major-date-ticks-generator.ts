import {MajorTicksGenerator} from "../major-ticks-generator";
import {Tick} from "../tick";
import {TimeUnit} from "./time-unit";
import {Range} from "../../../../geometry";

import * as moment from "moment";
import {MajorDateTicksGenerator} from "./major-date-ticks-generator";
import {
  MajorDaysTicksGenerator,
  MajorHoursTicksGenerator,
  MajorMinutesTicksGenerator, MajorMonthsTicksGenerator,
  MajorSecondsTicksGenerator, MajorYearsTicksGenerator
} from "./time-period";

export class SecondaryMajorDateTicksGenerator extends MajorTicksGenerator<Date> {
  private primaryTicksGenerator: MajorDateTicksGenerator;

  private majorSecondsTicksGenerator: MajorSecondsTicksGenerator;
  private majorMinutesTicksGenerator: MajorMinutesTicksGenerator;
  private majorHoursTicksGenerator: MajorHoursTicksGenerator;
  private majorDaysTicksGenerator: MajorDaysTicksGenerator;
  private majorMonthsTicksGenerator: MajorMonthsTicksGenerator;
  private majorYearsTicksGenerator: MajorYearsTicksGenerator;

  constructor(tickHeight: number, primaryTicksGenerator: MajorDateTicksGenerator) {
    super(tickHeight);

    this.primaryTicksGenerator = primaryTicksGenerator;

    this.majorSecondsTicksGenerator = new MajorSecondsTicksGenerator(tickHeight, false);
    this.majorMinutesTicksGenerator = new MajorMinutesTicksGenerator(tickHeight, false);
    this.majorHoursTicksGenerator = new MajorHoursTicksGenerator(tickHeight, false);
    this.majorDaysTicksGenerator = new MajorDaysTicksGenerator(tickHeight, false);
    this.majorMonthsTicksGenerator = new MajorMonthsTicksGenerator(tickHeight, false);
    this.majorYearsTicksGenerator = new MajorYearsTicksGenerator(tickHeight, false);
  }

  generateTicks(range: Range<Date>, ticksCount: number): Array<Tick<Date>> {
    let min = moment(range.min);
    let max = moment(range.min);

    let primaryUnit = this.primaryTicksGenerator.getSuitableTimeUnitTicksGenerator(range).timeUnit;

    if (primaryUnit === TimeUnit.Years) {
      return this.majorMonthsTicksGenerator.generateTicks(range, ticksCount);
    } else if (primaryUnit === TimeUnit.Months) {
      return this.majorDaysTicksGenerator.generateTicks(range, ticksCount);
    } else if (primaryUnit === TimeUnit.Days) {
      return this.majorHoursTicksGenerator.generateTicks(range, ticksCount);
    } else if (primaryUnit === TimeUnit.Hours) {
      return this.majorMinutesTicksGenerator.generateTicks(range, ticksCount);
    } else if (primaryUnit === TimeUnit.Minutes) {
      return this.majorSecondsTicksGenerator.generateTicks(range, ticksCount);
    } else {
      return this..generateTicks(range, ticksCount);
    }
  }
}
