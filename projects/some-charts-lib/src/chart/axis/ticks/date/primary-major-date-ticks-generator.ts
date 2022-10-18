import {MajorTicksGenerator} from "../major-ticks-generator";
import {Tick} from "../tick";
import {MajorTimeUnitTicksGenerator} from "./major-time-unit-ticks-generator";
import { TimeUnit } from "./time-unit";
import {
  MajorDaysTicksGenerator,
  MajorHoursTicksGenerator,
  MajorMinutesTicksGenerator,
  MajorMonthsTicksGenerator,
  MajorSecondsTicksGenerator,
  MajorYearsTicksGenerator
} from "./time-period";

export class PrimaryMajorDateTicksGenerator extends MajorTicksGenerator<Date> {

  private majorSecondsTicksGenerator: MajorSecondsTicksGenerator;
  private majorMinutesTicksGenerator: MajorMinutesTicksGenerator;
  private majorHoursTicksGenerator: MajorHoursTicksGenerator;
  private majorDaysTicksGenerator: MajorDaysTicksGenerator;
  private majorMonthsTicksGenerator: MajorMonthsTicksGenerator;
  private majorYearsTicksGenerator: MajorYearsTicksGenerator;

  constructor(majorTickHeight: number) {
    super(majorTickHeight);

    this.majorSecondsTicksGenerator = new MajorSecondsTicksGenerator(majorTickHeight, true);
    this.majorMinutesTicksGenerator = new MajorMinutesTicksGenerator(majorTickHeight, true);
    this.majorHoursTicksGenerator = new MajorHoursTicksGenerator(majorTickHeight, true);
    this.majorDaysTicksGenerator = new MajorDaysTicksGenerator(majorTickHeight, true);
    this.majorMonthsTicksGenerator = new MajorMonthsTicksGenerator(majorTickHeight, true);
    this.majorYearsTicksGenerator = new MajorYearsTicksGenerator(majorTickHeight, true);
  }

  generateTicks(range: Range<Date>, ticksCount: number): Array<Tick<Date>> {



    use seconds if you have less than 2 minutes worth (1-120)
    use minutes if you have less than 2 hours worth (2-120)
    use hours if you have less than 2 days worth (2-48)
    use days if you have less than 2 weeks worth (2-14)
    use weeks if you have less than 2 months worth (2-8/9)
    use months if you have less than 2 years worth (2-24)
    otherwise use years

  }
}
