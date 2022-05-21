import {Tick} from "../tick";
import {Range} from "../../../../model/range"
import {MinorTicksGenerator} from "../minor-ticks-generator";

export class NumericMinorTicksGenerator implements MinorTicksGenerator<number> {

  protected static defaultMinorTicksCount: number = 4;

  protected readonly minorTicksCount: number;
  protected minorTickHeight: number;

  constructor(minorTickHeight: number, minorTicksCount?: number) {
    this.minorTicksCount = minorTicksCount ?? NumericMinorTicksGenerator.defaultMinorTicksCount;
    this.minorTickHeight = minorTickHeight;
  }

  generateMinorTicks(range: Range<number>, majorTicks: Array<Tick<number>>): Array<Tick<number>> {
    if (majorTicks.length < 2) {
      return [];
    } else {
      //Create and fill ticks array.
      let res: Array<Tick<number>> = [];
      let step = (majorTicks[1].value - majorTicks[0].value) / (this.minorTicksCount + 1);

      let firstTick = majorTicks[0];
      let minBound = firstTick.value < range.min ? range.min : firstTick.value;

      let lastTick = majorTicks[majorTicks.length - 1];
      let maxBound = lastTick.value > range.max ? range.max : lastTick.value;

      let x = majorTicks[1].value - step;
      let tickIndex = 0;
      while (x >= minBound) {
        res.push({value: x, length: this.minorTickHeight, index: tickIndex++});
        x -= step;
      }

      x = majorTicks[majorTicks.length - 2].value + step;
      while (x <= maxBound) {
        res.push({value: x, length: this.minorTickHeight, index: tickIndex++});
        x += step;
      }

      for (let i = 1; i < majorTicks.length - 1; i++) {
        x = majorTicks[i].value + step;

        for (let j = 0; j < this.minorTicksCount; j++) {
          res.push({value: x, length: this.minorTickHeight, index: tickIndex++});
          x += step;
        }
      }

      return res;
    }
  }
}
