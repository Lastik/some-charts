import {LabeledTick, MajorTicksGenerator, Tick} from "../../../index";
import {Range} from "../../../../geometry";
import {TimeUnit} from "./time-unit";
import * as moment from "moment";
import {MathHelper} from "../../../../services";

export abstract class MajorTimeUnitTicksGenerator extends MajorTicksGenerator<Date> {

  constructor(tickHeight: number) {
    super(tickHeight);
  }

  abstract get timeUnit(): TimeUnit;

  generateTicks(range: Range<Date>, ticksCount: number): Array<Tick<Date>> {

    let zero = moment(new Date());

    let min = moment(range.min).startOf(this.timeUnit).subtract(1, this.timeUnit);
    let max = moment(range.min).endOf(this.timeUnit).add(1, this.timeUnit);

    let delta = max.diff(min, this.timeUnit);

    let niceDelta = MathHelper.calcNiceNumber(delta, false)
    let tickSpacing = MathHelper.calcNiceNumber(niceDelta / (ticksCount - 1), true);
    let niceMin = zero.add(Math.floor(zero.diff(min, this.timeUnit) / tickSpacing) * tickSpacing);
    let niceMax = zero.add(Math.ceil(zero.diff(max, this.timeUnit) / tickSpacing) * tickSpacing);

    let x = niceMin;

    let xArr = [];

    do {
      xArr.push(x);
      x.add(tickSpacing);
    } while (x.isSameOrBefore(niceMax));

    return xArr.map((value, index) => {
      return new LabeledTick<Date>(value.toDate(), this.tickHeight, index, this.getTimeUnitValueAsString(value));
    });
  }

  protected abstract getTimeUnitValueAsString(date: moment.Moment): string;
}
