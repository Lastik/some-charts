import {Tick} from "../tick";
import {Range} from "../../../../index"
import {MinorTicksGenerator} from "../minor-ticks-generator";

export class NumericMinorTicksGenerator implements MinorTicksGenerator<number> {

  protected readonly stepsCount: number;
  protected tickHeight: number;

  constructor(minorTickHeight: number, stepsCount?: number) {
    this.stepsCount = stepsCount ?? 5;
    this.tickHeight = minorTickHeight;
  }

  generateTicks(range: Range<number>, majorTicks: Array<Tick<number>>): Array<Tick<number>> {
    if (majorTicks.length < 2) {
      return [];
    } else {
      //Create and fill ticks array.
      let res: Array<Tick<number>> = [];
      let step = (majorTicks[1].value - majorTicks[0].value) / (this.stepsCount - 1);

      let firstTick = majorTicks[0];
      let minBound = firstTick.value < range.min ? range.min : firstTick.value;

      let lastTick = majorTicks[majorTicks.length - 1];
      let maxBound = lastTick.value > range.max ? range.max : lastTick.value;

      let x = majorTicks[1].value - step;
      let tickIndex = 0;
      while (x >= minBound) {
        res.push(new Tick<number>(x, this.tickHeight, tickIndex++));
        x -= step;
      }

      x = majorTicks[majorTicks.length - 2].value + step;
      while (x <= maxBound) {
        res.push(new Tick<number>(x, this.tickHeight, tickIndex++));
        x += step;
      }

      for (let i = 1; i < majorTicks.length - 1; i++) {
        x = majorTicks[i].value + step;

        for (let j = 0; j < this.stepsCount; j++) {
          res.push(new Tick<number>(x, this.tickHeight, tickIndex++));
          x += step;
        }
      }

      return res;
    }
  }
}
