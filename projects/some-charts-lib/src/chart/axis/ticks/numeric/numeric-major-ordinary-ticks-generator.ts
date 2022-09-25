import {Tick} from "../tick";
import {Range} from "../../../../index"
import {MajorTicksGenerator} from "../major-ticks-generator";
import {MathHelper} from "../../../../services";

export class NumericMajorOrdinaryTicksGenerator extends MajorTicksGenerator<number> {

  protected static readonly majorTicksCount = [1, 2, 3, 4, 5, 10, 20, 40, 80];
  protected static readonly majorTicksCountRev = NumericMajorOrdinaryTicksGenerator.majorTicksCount.reverse();

  constructor(majorTickHeight: number) {
    super(majorTickHeight);
  }

  generateTicks(range: Range<number>, ticksCount: number): Array<Tick<number>> {

    let start = range.min;
    let finish = range.max;
    let delta = finish - start;

    if (delta == 0)
      return ([start, finish]).map((value, index) => {
        return new Tick<number>(value, this.majorTickHeight, index);
      });
    else {
      let log = Math.round(Math.log10(delta));
      let newStart = MathHelper.round(start, log);
      let newFinish = MathHelper.round(finish, log);
      if (newStart == newFinish) {
        log--;
        newStart = MathHelper.round(start, log);
        newFinish = MathHelper.round(finish, log);
      }

      let unroundedStep = (newFinish - newStart) / ticksCount;
      let stepLog = log;
      let step = MathHelper.floor(unroundedStep, stepLog);
      if (step == 0) {
        stepLog--;
        step = MathHelper.floor(unroundedStep, stepLog);
        if (step == 0)
          step = unroundedStep;
      }

      let x = step * Math.floor(start / step);
      let res = [];
      let increasedFinish = finish + step;
      while (x <= increasedFinish) {
        res.push(MathHelper.round(x, log - 3));
        x += step;
      }

      return res.map((value, index) => {
        return new Tick<number>(value, this.majorTickHeight, index);
      });
    }
  }

  suggestDecreasedTickCount(ticksCount: number): number {
    for (let suggestion of NumericMajorOrdinaryTicksGenerator.majorTicksCountRev) {
      if (suggestion < ticksCount)
        return suggestion;
    }
    return NumericMajorOrdinaryTicksGenerator.majorTicksCount[0];
  }

  suggestIncreasedTicksCount(ticksCount: number): number {
    let newTickCount = undefined;
    for (let suggestion of NumericMajorOrdinaryTicksGenerator.majorTicksCount) {
      if (suggestion > ticksCount) {
        newTickCount = suggestion;
        break;
      }
    }

    if (newTickCount === undefined)
      newTickCount = NumericMajorOrdinaryTicksGenerator.majorTicksCountRev[0];

    return newTickCount;
  }
}
