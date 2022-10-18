import {Tick} from "../../../tick";
import { TimeUnit } from "../../time-unit";
import {Range} from "../../../../../../geometry";

import * as moment from "moment";
import { MinorSecondsTicksGenerator } from "./minor-seconds-ticks-generator";
import { MinorMinutesTicksGenerator } from "./minor-minutes-ticks-generator";
import { MinorHoursTicksGenerator } from "./minor-hours-ticks-generator";
import { MinorMonthsTicksGenerator } from "./minor-months-ticks-generator";
import { MinorDaysTicksGenerator } from "./minor-days-ticks-generator";
import {MinorYearsTicksGenerator} from "./minor-years-ticks-generator";
import {MinorTimeUnitTicksGenerator} from "./minor-time-unit-ticks-generator";
import {MajorTicksGenerator} from "../../../major-ticks-generator";
import {MajorDateTicksGenerator} from "../major";
import {MinorTicksGenerator} from "../../../minor-ticks-generator";

export class MinorDateTicksGenerator implements MinorTicksGenerator<Date> {

  private tickHeight: number;
  private majorTicksGenerator: MajorDateTicksGenerator;

  private majorSecondsTicksGenerator: MinorSecondsTicksGenerator;
  private majorMinutesTicksGenerator: MinorMinutesTicksGenerator;
  private majorHoursTicksGenerator: MinorHoursTicksGenerator;
  private majorDaysTicksGenerator: MinorDaysTicksGenerator;
  private majorMonthsTicksGenerator: MinorMonthsTicksGenerator;
  private majorYearsTicksGenerator: MinorYearsTicksGenerator;

  constructor(tickHeight: number, majorTicksGenerator: MajorDateTicksGenerator) {
    this.tickHeight = tickHeight;

    this.majorTicksGenerator = majorTicksGenerator;

    this.majorSecondsTicksGenerator = new MinorSecondsTicksGenerator(tickHeight);
    this.majorMinutesTicksGenerator = new MinorMinutesTicksGenerator(tickHeight);
    this.majorHoursTicksGenerator = new MinorHoursTicksGenerator(tickHeight);
    this.majorDaysTicksGenerator = new MinorDaysTicksGenerator(tickHeight);
    this.majorMonthsTicksGenerator = new MinorMonthsTicksGenerator(tickHeight);
    this.majorYearsTicksGenerator = new MinorYearsTicksGenerator(tickHeight);
  }



  getSuitableTimeUnitTicksGenerator(range: Range<Date>): MinorTimeUnitTicksGenerator | undefined {

    let min = moment(range.min);
    let max = moment(range.min);

    let secondaryUnit = this.majorTicksGenerator.getSuitableTimeUnitTicksGenerator(range).timeUnit;

    if (secondaryUnit === TimeUnit.Years) {
      return undefined;
    } else if (secondaryUnit === TimeUnit.Months) {
      return this.majorYearsTicksGenerator;
    } else if (secondaryUnit === TimeUnit.Days) {
      return this.majorMonthsTicksGenerator;
    } else if (secondaryUnit === TimeUnit.Hours) {
      return this.majorDaysTicksGenerator;
    } else if (secondaryUnit === TimeUnit.Minutes) {
      return this.majorHoursTicksGenerator;
    } else if (secondaryUnit === TimeUnit.Seconds) {
      return this.majorMinutesTicksGenerator;
    } else {
      return this.majorSecondsTicksGenerator;
    }
  }

  generateTicks(range: Range<Date>, majorTicks: Array<Tick<Date>>): Array<Tick<Date>> {
    return this.getSuitableTimeUnitTicksGenerator(range)?.generateTicks(range, majorTicks) ?? [];
  }
}
