import {Range} from "../../../../../../geometry";
import {TimeUnit} from "../../time-unit";
import * as moment from "moment";
import {MathHelper} from "../../../../../../services";
import {MajorTicksGenerator} from "../../../major-ticks-generator";
import {Tick} from "../../../tick";
import {LabeledTick} from "../../../labeled-tick";
import {filter, first, flow, partialRight} from "lodash-es";
import map from "lodash-es/map";
import sortBy from "lodash-es/sortBy";

export abstract class MajorTimeUnitTicksGenerator extends MajorTicksGenerator<Date> {

  constructor(tickHeight: number) {
    super(tickHeight);
  }

  abstract get timeUnit(): TimeUnit;

  generateTicks(range: Range<Date>, ticksCount: number): Array<Tick<Date>> {

    let zero = moment(new Date(0)).startOf(this.timeUnit);

    let min = moment(range.min).startOf(this.timeUnit).subtract(1, this.timeUnit);
    let max = moment(range.max).startOf(this.timeUnit).add(2, this.timeUnit);

    let delta = max.diff(min, this.timeUnit);

    let niceDelta = MathHelper.calcNiceNumber(delta, false);

    let tickSpacing: number;

    switch(this.timeUnit) {
      case TimeUnit.Years:
      case TimeUnit.Months:
      case TimeUnit.Days:
      case TimeUnit.Milliseconds:
        tickSpacing = Math.ceil(MathHelper.calcNiceNumber(niceDelta / (ticksCount - 1), true));
        break;
      case TimeUnit.Hours:
        tickSpacing = this.chooseTicksSpacingOutOfOptions([1, 2, 3, 4, 6, 12, 24], niceDelta, ticksCount);
        break;
      case TimeUnit.Minutes:
      case TimeUnit.Seconds:
        tickSpacing = this.chooseTicksSpacingOutOfOptions([1, 2, 3, 5, 10, 15, 20, 30, 60], niceDelta, ticksCount);
        break;
    }

    if(this.timeUnit === TimeUnit.Milliseconds && tickSpacing < 1){
      tickSpacing = 1;
    }

    let niceMin: moment.Moment;
    let niceMax: moment.Moment;

    if(this.timeUnit === TimeUnit.Years || this.timeUnit === TimeUnit.Months || this.timeUnit === TimeUnit.Days) {
      niceMin = zero.clone().add(Math.floor(min.diff(zero, this.timeUnit) / tickSpacing) * tickSpacing, this.timeUnit);
      niceMax = zero.clone().add(Math.ceil(max.diff(zero, this.timeUnit) / tickSpacing) * tickSpacing, this.timeUnit);
    }
    else {
      niceMin = min.clone().set(this.timeUnit, Math.floor(min.get(this.timeUnit) / tickSpacing) * tickSpacing);
      niceMax = max.clone().set(this.timeUnit, Math.ceil(max.get(this.timeUnit) / tickSpacing) * tickSpacing);
    }

    let x = niceMin.clone();

    let xArr = [];

    do {
      xArr.push(x.clone());
      x.add(tickSpacing, this.timeUnit);
    } while (x.isSameOrBefore(niceMax));

    return xArr.map((value, index) => {
      return new LabeledTick<Date>(value.toDate(), this.tickHeight, index, this.getTimeUnitValueAsString(value));
    });
  }

  protected chooseTicksSpacingOutOfOptions(spacingOptions: Array<number>, ticksDelta: number, ticksCount: number): number{

    let dirtySpacing = ticksDelta / (ticksCount - 1);

    return flow(
      partialRight(map, ((spacingOption: number) => {
        return {diff: spacingOption - dirtySpacing, spacing: spacingOption};
      })),
      partialRight(filter, (v: {diff: number, spacing: number}) => {
          return v.diff > 0;
        }
      ),
      partialRight(sortBy, (v: {diff: number, spacing: number}) => v.diff),
      partialRight(map, (v: {diff: number, spacing: number}) => v.spacing),
      first)(spacingOptions);
  }

  protected abstract getTimeUnitValueAsString(date: moment.Moment): string;
}
