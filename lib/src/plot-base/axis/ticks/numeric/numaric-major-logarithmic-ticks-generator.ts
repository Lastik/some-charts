import {Tick} from "../tick";
import {Range} from "../../../../model/range"
import {MajorTicksGenerator} from "../major-ticks-generator";

export class NumericMajorLogarithmicTicksGenerator extends MajorTicksGenerator<number> {
  private logarithmBase: number;

  constructor(logarithmBase: number, majorTickHeight: number) {
    super(majorTickHeight);

    this.logarithmBase = logarithmBase;
  }

  generateTicks(range: Range<number>, ticksCount: number): Array<Tick<number>> {
    let firstTickValue = Math.floor(this.logByBase(range.min));
    let lastTickValue = Math.ceil(this.logByBase(range.max));

    let actualTicksCount = lastTickValue - firstTickValue + 1;

    let ticks = Array(actualTicksCount);
    for (let i = 0; i < actualTicksCount; i++) {
      ticks[i] = new Tick(
        Math.pow(this.logarithmBase, firstTickValue + i),
        this.majorTickHeight,
        i);
    }

    return ticks;
  }

  suggestDecreasedTickCount(ticksCount: number): number {
    return ticksCount;
  }

  suggestIncreasedTicksCount(ticksCount: number): number {
    return ticksCount;
  }

  private logByBase(value: number): number{
    return Math.log(value) / Math.log(this.logarithmBase);
  }
}
