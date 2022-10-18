import {Range} from "../../../../../../../geometry";
import {TimeUnit} from "../../../time-unit";
import * as moment from "moment";
import { MinorTicksGenerator } from "../../../../minor-ticks-generator";
import { Tick } from "../../../../tick";
import {LabeledTick} from "../../../../labeled-tick";
import {MinorDateTick} from "../../../minor-date-tick";
import {MinorLvl2DaysTicksGenerator} from "./minor-lvl2-days-ticks-generator";

export abstract class MinorLvl2TimeUnitTicksGenerator implements MinorTicksGenerator<Date> {

  private tickHeight: number;

  constructor(tickHeight: number) {
    this.tickHeight = tickHeight;
  }

  generateTicks(range: Range<Date>, majorTicks: Tick<Date>[]): Tick<Date>[] {
    let zero = moment(new Date(0));

    let min = moment(range.min).startOf(this.timeUnit);
    let max = moment(range.max).startOf(this.timeUnit).add(1, this.timeUnit);

    return [
      new MinorDateTick(range.min, this.tickHeight, 0, this.getTimeUnitValueAsString(min), 2, 'left'),
    ]
  }

  abstract get timeUnit(): TimeUnit;

  protected abstract getTimeUnitValueAsString(date: moment.Moment): string;
}
