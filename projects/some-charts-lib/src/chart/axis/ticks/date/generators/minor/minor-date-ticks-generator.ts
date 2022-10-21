import {Tick} from "../../../tick";
import { TimeUnit } from "../../time-unit";
import {Range} from "../../../../../../geometry";
import {MajorDateTicksGenerator} from "../major";
import {MinorTicksGenerator} from "../../../minor-ticks-generator";
import {
  MinorLvl1DaysTicksGenerator,
  MinorLvl1HoursTicksGenerator,
  MinorLvl1MinutesTicksGenerator, MinorLvl1MonthsTicksGenerator,
  MinorLvl1SecondsTicksGenerator, MinorLvl1TimeUnitTicksGenerator, MinorLvl1YearsTicksGenerator
} from "./lvl1";
import {
  MinorLvl2DaysTicksGenerator,
  MinorLvl2HoursTicksGenerator,
  MinorLvl2MinutesTicksGenerator, MinorLvl2MonthsTicksGenerator,
  MinorLvl2TimeUnitTicksGenerator, MinorLvl2YearsTicksGenerator
} from "./lvl2";
import * as moment from "moment";

export class MinorDateTicksGenerator implements MinorTicksGenerator<Date> {

  private tickHeight: number;
  private majorTicksGenerator: MajorDateTicksGenerator;

  private readonly minorLvl1SecondsTicksGenerator: MinorLvl1SecondsTicksGenerator;
  private readonly minorLvl1MinutesTicksGenerator: MinorLvl1MinutesTicksGenerator;
  private readonly minorLvl1HoursTicksGenerator: MinorLvl1HoursTicksGenerator;
  private readonly minorLvl1DaysTicksGenerator: MinorLvl1DaysTicksGenerator;
  private readonly minorLvl1MonthsTicksGenerator: MinorLvl1MonthsTicksGenerator;
  private readonly minorLvl1YearsTicksGenerator: MinorLvl1YearsTicksGenerator;

  private readonly minorLvl2MinutesTicksGenerator: MinorLvl2MinutesTicksGenerator;
  private readonly minorLvl2HoursTicksGenerator: MinorLvl2HoursTicksGenerator;
  private readonly minorLvl2DaysTicksGenerator: MinorLvl2DaysTicksGenerator;
  private readonly minorLvl2MonthsTicksGenerator: MinorLvl2MonthsTicksGenerator;
  private readonly minorLvl2YearsTicksGenerator: MinorLvl2YearsTicksGenerator;

  constructor(tickHeight: number, majorTicksGenerator: MajorDateTicksGenerator) {
    this.tickHeight = tickHeight;

    this.majorTicksGenerator = majorTicksGenerator;

    this.minorLvl1SecondsTicksGenerator = new MinorLvl1SecondsTicksGenerator(tickHeight);
    this.minorLvl1MinutesTicksGenerator = new MinorLvl1MinutesTicksGenerator(tickHeight);
    this.minorLvl1HoursTicksGenerator = new MinorLvl1HoursTicksGenerator(tickHeight);
    this.minorLvl1DaysTicksGenerator = new MinorLvl1DaysTicksGenerator(tickHeight);
    this.minorLvl1MonthsTicksGenerator = new MinorLvl1MonthsTicksGenerator(tickHeight);
    this.minorLvl1YearsTicksGenerator = new MinorLvl1YearsTicksGenerator(tickHeight);

    this.minorLvl2MinutesTicksGenerator = new MinorLvl2MinutesTicksGenerator(tickHeight);
    this.minorLvl2HoursTicksGenerator = new MinorLvl2HoursTicksGenerator(tickHeight);
    this.minorLvl2DaysTicksGenerator = new MinorLvl2DaysTicksGenerator(tickHeight);
    this.minorLvl2MonthsTicksGenerator = new MinorLvl2MonthsTicksGenerator(tickHeight);
    this.minorLvl2YearsTicksGenerator = new MinorLvl2YearsTicksGenerator(tickHeight);
  }



  getSuitableLvl1TimeUnitTicksGenerator(range: Range<Date>): MinorLvl1TimeUnitTicksGenerator | undefined {

    let majorGeneratorTimeUnits = this.majorTicksGenerator.getSuitableTimeUnitTicksGenerator(range).timeUnit;

    if (majorGeneratorTimeUnits === TimeUnit.Years) {
      return undefined;
    } else if (majorGeneratorTimeUnits === TimeUnit.Months) {
      return this.minorLvl1YearsTicksGenerator;
    } else if (majorGeneratorTimeUnits === TimeUnit.Days) {
      return this.minorLvl1MonthsTicksGenerator;
    } else if (majorGeneratorTimeUnits === TimeUnit.Hours) {
      return this.minorLvl1DaysTicksGenerator;
    } else if (majorGeneratorTimeUnits === TimeUnit.Minutes) {
      return this.minorLvl1HoursTicksGenerator;
    } else if (majorGeneratorTimeUnits === TimeUnit.Seconds) {
      return this.minorLvl1MinutesTicksGenerator;
    } else {
      return this.minorLvl1SecondsTicksGenerator;
    }
  }

  getSuitableLvl2TimeUnitTicksGenerator(range: Range<Date>): MinorLvl2TimeUnitTicksGenerator | undefined {

    let majorGeneratorTimeUnits = this.majorTicksGenerator.getSuitableTimeUnitTicksGenerator(range).timeUnit;

    let min = moment(range.min);
    let max = moment(range.max);

    if (majorGeneratorTimeUnits === TimeUnit.Years) {
      return undefined;
    } else if (majorGeneratorTimeUnits === TimeUnit.Months) {
      return this.minorLvl2YearsTicksGenerator;
    } else if (majorGeneratorTimeUnits === TimeUnit.Days) {
      if (Math.abs(max.get(TimeUnit.Months) - min.get(TimeUnit.Months)) >= 1) {
        return this.minorLvl2YearsTicksGenerator;
      } else {
        return this.minorLvl2MonthsTicksGenerator;
      }
    } else if (majorGeneratorTimeUnits === TimeUnit.Hours) {
      if (Math.abs(max.get(TimeUnit.Days) - min.get(TimeUnit.Days)) >= 1) {
        return this.minorLvl2MonthsTicksGenerator;
      } else {
        return this.minorLvl2DaysTicksGenerator;
      }
    } else if (majorGeneratorTimeUnits === TimeUnit.Minutes) {
      if (Math.abs(max.get(TimeUnit.Hours) - min.get(TimeUnit.Hours)) >= 1) {
        return this.minorLvl2DaysTicksGenerator;
      } else {
        return this.minorLvl2HoursTicksGenerator;
      }
    } else if (majorGeneratorTimeUnits === TimeUnit.Seconds) {
      if (Math.abs(max.get(TimeUnit.Minutes) - min.get(TimeUnit.Minutes)) >= 1) {
        return this.minorLvl2HoursTicksGenerator;
      } else {
        return this.minorLvl2MinutesTicksGenerator;
      }
    } else {
      return this.minorLvl2MinutesTicksGenerator;
    }
  }

  generateTicks(range: Range<Date>, majorTicks: Array<Tick<Date>>): Array<Tick<Date>> {
    let lvl1Ticks = this.getSuitableLvl1TimeUnitTicksGenerator(range)?.generateTicks(range, majorTicks) ?? [];
    let lvl2Ticks = this.getSuitableLvl2TimeUnitTicksGenerator(range)?.generateTicks(range, majorTicks) ?? [];
    return lvl1Ticks.concat(lvl2Ticks);
  }
}
