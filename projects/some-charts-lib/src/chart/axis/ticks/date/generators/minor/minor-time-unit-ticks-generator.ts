import {Range} from "../../../../../../geometry";
import {TimeUnit} from "../../time-unit";
import * as moment from "moment";
import { MinorTicksGenerator } from "../../../minor-ticks-generator";
import { Tick } from "../../../tick";
import {LabeledTick} from "../../../labeled-tick";

export abstract class MinorTimeUnitTicksGenerator implements MinorTicksGenerator<Date> {

  private tickHeight: number;

  constructor(tickHeight: number) {
    this.tickHeight = tickHeight;
  }

  generateTicks(range: Range<Date>, majorTicks: Tick<Date>[]): Tick<Date>[] {
    let zero = moment(new Date(0));

    let min = moment(range.min).startOf(this.timeUnit);
    let max = moment(range.max).endOf(this.timeUnit);

    let delta = max.diff(min, this.timeUnit, true);

    if (delta <= 1) {
      return [
        new LabeledTick<Date>(range.max, this.tickHeight, 0, this.getTimeUnitValueAsString(max)),
      ]
    } else {
      let x = min;

      let till = max.clone().add(1, this.timeUnit);

      let ticks = [];

      do {
        ticks.push(new LabeledTick<Date>(x.toDate(), this.tickHeight, 0, this.getTimeUnitValueAsString(max)));
        x.add(1, this.timeUnit);
      } while (x.isSameOrBefore(till));

      return ticks;
    }
  }

  abstract get timeUnit(): TimeUnit;

  protected abstract getTimeUnitValueAsString(date: moment.Moment): string;
}
