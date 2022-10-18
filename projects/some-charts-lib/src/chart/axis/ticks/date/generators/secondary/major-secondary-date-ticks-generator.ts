import {Tick} from "../../../tick";
import { TimeUnit } from "../../time-unit";
import {Range} from "../../../../../../geometry";

import * as moment from "moment";
import { MajorSecondarySecondsTicksGenerator } from "./major-secondary-seconds-ticks-generator";
import { MajorSecondaryMinutesTicksGenerator } from "./major-secondary-minutes-ticks-generator";
import { MajorSecondaryHoursTicksGenerator } from "./major-secondary-hours-ticks-generator";
import { MajorSecondaryMonthsTicksGenerator } from "./major-secondary-months-ticks-generator";
import { MajorSecondaryDaysTicksGenerator } from "./major-secondary-days-ticks-generator";
import {MajorSecondaryTimeUnitTicksGenerator} from "./major-secondary-time-unit-ticks-generator";
import {MajorTicksGenerator} from "../../../major-ticks-generator";
import {MajorSecondaryYearsTicksGenerator} from "./major-secondary-years-ticks-generator";

export class MajorSecondaryDateTicksGenerator extends MajorTicksGenerator<Date> {

  private majorSecondsTicksGenerator: MajorSecondarySecondsTicksGenerator;
  private majorMinutesTicksGenerator: MajorSecondaryMinutesTicksGenerator;
  private majorHoursTicksGenerator: MajorSecondaryHoursTicksGenerator;
  private majorDaysTicksGenerator: MajorSecondaryDaysTicksGenerator;
  private majorMonthsTicksGenerator: MajorSecondaryMonthsTicksGenerator;
  private majorYearsTicksGenerator: MajorSecondaryYearsTicksGenerator;

  constructor(tickHeight: number) {
    super(tickHeight);

    this.majorSecondsTicksGenerator = new MajorSecondarySecondsTicksGenerator(tickHeight);
    this.majorMinutesTicksGenerator = new MajorSecondaryMinutesTicksGenerator(tickHeight);
    this.majorHoursTicksGenerator = new MajorSecondaryHoursTicksGenerator(tickHeight);
    this.majorDaysTicksGenerator = new MajorSecondaryDaysTicksGenerator(tickHeight);
    this.majorMonthsTicksGenerator = new MajorSecondaryMonthsTicksGenerator(tickHeight);
    this.majorYearsTicksGenerator = new MajorSecondaryYearsTicksGenerator(tickHeight);
  }

  generateTicks(range: Range<Date>, ticksCount: number): Array<Tick<Date>> {
    return this.getSuitableTimeUnitTicksGenerator(range).generateTicks(range, ticksCount);
  }

  getSuitableTimeUnitTicksGenerator(range: Range<Date>): MajorSecondaryTimeUnitTicksGenerator {

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
