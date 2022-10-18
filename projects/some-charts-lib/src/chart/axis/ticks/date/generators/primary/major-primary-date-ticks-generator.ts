import {Tick} from "../../../tick";
import { TimeUnit } from "../../time-unit";
import {Range} from "../../../../../../geometry";

import * as moment from "moment";
import { MajorPrimarySecondsTicksGenerator } from "./major-primary-seconds-ticks-generator";
import { MajorPrimaryMinutesTicksGenerator } from "./major-primary-minutes-ticks-generator";
import { MajorPrimaryHoursTicksGenerator } from "./major-primary-hours-ticks-generator";
import { MajorPrimaryMonthsTicksGenerator } from "./major-primary-months-ticks-generator";
import { MajorPrimaryDaysTicksGenerator } from "./major-primary-days-ticks-generator";
import {MajorPrimaryYearsTicksGenerator} from "./major-primary-years-ticks-generator";
import {MajorPrimaryTimeUnitTicksGenerator} from "./major-primary-time-unit-ticks-generator";
import {MajorTicksGenerator} from "../../../major-ticks-generator";
import {MajorSecondaryDateTicksGenerator} from "../secondary";

export class MajorPrimaryDateTicksGenerator extends MajorTicksGenerator<Date> {

  private secondaryTicksGenerator: MajorSecondaryDateTicksGenerator;

  private majorSecondsTicksGenerator: MajorPrimarySecondsTicksGenerator;
  private majorMinutesTicksGenerator: MajorPrimaryMinutesTicksGenerator;
  private majorHoursTicksGenerator: MajorPrimaryHoursTicksGenerator;
  private majorDaysTicksGenerator: MajorPrimaryDaysTicksGenerator;
  private majorMonthsTicksGenerator: MajorPrimaryMonthsTicksGenerator;
  private majorYearsTicksGenerator: MajorPrimaryYearsTicksGenerator;

  constructor(tickHeight: number, secondaryTicksGenerator: MajorSecondaryDateTicksGenerator) {
    super(tickHeight);

    this.secondaryTicksGenerator = secondaryTicksGenerator;

    this.majorSecondsTicksGenerator = new MajorPrimarySecondsTicksGenerator(tickHeight);
    this.majorMinutesTicksGenerator = new MajorPrimaryMinutesTicksGenerator(tickHeight);
    this.majorHoursTicksGenerator = new MajorPrimaryHoursTicksGenerator(tickHeight);
    this.majorDaysTicksGenerator = new MajorPrimaryDaysTicksGenerator(tickHeight);
    this.majorMonthsTicksGenerator = new MajorPrimaryMonthsTicksGenerator(tickHeight);
    this.majorYearsTicksGenerator = new MajorPrimaryYearsTicksGenerator(tickHeight);
  }

  generateTicks(range: Range<Date>, ticksCount: number): Array<Tick<Date>> {
    return this.getSuitableTimeUnitTicksGenerator(range)?.generateTicks(range, ticksCount) ?? [];
  }

  getSuitableTimeUnitTicksGenerator(range: Range<Date>): MajorPrimaryTimeUnitTicksGenerator | undefined {

    let min = moment(range.min);
    let max = moment(range.min);

    let secondaryUnit = this.secondaryTicksGenerator.getSuitableTimeUnitTicksGenerator(range).timeUnit;

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
}
