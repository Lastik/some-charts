import {Range} from "../../../../../../../geometry";
import {TimeUnit} from "../../../time-unit";
import * as moment from "moment";
import { MinorTicksGenerator } from "../../../../minor-ticks-generator";
import { Tick } from "../../../../tick";
import {LabeledTick} from "../../../../labeled-tick";
import {MinorDateTick} from "../../../minor-date-tick";
import {MinorLvl1DaysTicksGenerator} from "./minor-lvl1-days-ticks-generator";

export abstract class MinorLvl1TimeUnitTicksGenerator implements MinorTicksGenerator<Date> {

  private tickHeight: number;

  constructor(tickHeight: number) {
    this.tickHeight = tickHeight;
  }

  generateTicks(range: Range<Date>, majorTicks: Tick<Date>[]): Tick<Date>[] {
    let min = moment(range.min).startOf(this.timeUnit);
    let max = moment(range.max).endOf(this.timeUnit);

    let x = min;

    let till = max.clone().add(1, this.timeUnit);

    let ticks = [];

    do {
      ticks.push(new MinorDateTick(x.toDate(), this.tickHeight, 0, this.getTimeUnitValueAsString(x), 1, 'middle'));
      x.add(1, this.timeUnit);
    } while (x.isSameOrBefore(till));

    return ticks;
  }

  abstract get timeUnit(): TimeUnit;

  protected abstract getTimeUnitValueAsString(date: moment.Moment): string;
}
