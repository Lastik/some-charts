import {Range} from "../../../../../../geometry";
import {TimeUnit} from "../../time-unit";
import * as moment from "moment";
import {MathHelper} from "../../../../../../services";
import {MajorTicksGenerator} from "../../../major-ticks-generator";
import {Tick} from "../../../tick";
import {LabeledTick} from "../../../labeled-tick";

export abstract class MajorTimeUnitTicksGenerator extends MajorTicksGenerator<Date> {

  constructor(tickHeight: number) {
    super(tickHeight);
  }

  abstract get timeUnit(): TimeUnit;

  generateTicks(range: Range<Date>, ticksCount: number): Array<Tick<Date>> {

    let zero = moment(new Date(0));

    let min = moment(range.min).startOf(this.timeUnit).subtract(1, this.timeUnit);
    let max = moment(range.max).endOf(this.timeUnit).add(1, this.timeUnit);

    let delta = max.diff(min, this.timeUnit);

    let niceDelta = MathHelper.calcNiceNumber(delta, false)
    let tickSpacing = Math.ceil(MathHelper.calcNiceNumber(niceDelta / (ticksCount - 1), true));

    if(this.timeUnit === TimeUnit.Milliseconds && tickSpacing < 1){
      tickSpacing = 1;
    }

    let niceMin = zero.clone().add(Math.floor(min.diff(zero, this.timeUnit) / tickSpacing) * tickSpacing, this.timeUnit);
    let niceMax = zero.clone().add(Math.ceil(max.diff(zero, this.timeUnit) / tickSpacing) * tickSpacing, this.timeUnit);

    let x = niceMin;

    let xArr = [];

    let tickSpacingInUnits = moment.duration(tickSpacing, this.timeUnit);

    do {
      xArr.push(x.clone());
      x.add(tickSpacingInUnits.asMilliseconds(), TimeUnit.Milliseconds);
    } while (x.isSameOrBefore(niceMax));

    return xArr.map((value, index) => {
      return new LabeledTick<Date>(value.toDate(), this.tickHeight, index, this.getTimeUnitValueAsString(value));
    });
  }

  protected abstract getTimeUnitValueAsString(date: moment.Moment): string;
}
