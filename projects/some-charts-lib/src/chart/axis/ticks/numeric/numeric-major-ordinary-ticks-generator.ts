import {Tick} from "../tick";
import {Range} from "../../../../index"
import {MajorTicksGenerator} from "../major-ticks-generator";
import {MathHelper} from "../../../../services";

export class NumericMajorOrdinaryTicksGenerator extends MajorTicksGenerator<number, number> {

  constructor(majorTickHeight: number) {
    super(majorTickHeight);
  }

  generateTicks(range: Range<number>, ticksCount: number): Array<Tick<number>> {
    let delta = range.max - range.min;
    let niceDelta = MathHelper.calcNiceNumber(delta, false)
    let tickSpacing = MathHelper.calcNiceNumber(niceDelta / (ticksCount - 1), true);
    let niceMin = Math.floor(range.min / tickSpacing) * tickSpacing;
    let niceMax = Math.ceil(range.max / tickSpacing) * tickSpacing;

    let x = niceMin;

    let xArr = [];

    do {
      xArr.push(MathHelper.toFixed(x, 12));
      x += tickSpacing;
    } while (x <= niceMax);

    return xArr.map((value, index) => {
      return new Tick<number>(value, this.majorTickHeight, index);
    });
  }

  suggestDecreasedTickCount(ticksCount: number): number {
    if (ticksCount == 1) {
      return ticksCount;
    } else if (ticksCount <= 5) {
      return ticksCount - 1;
    } else if (ticksCount == 10) {
      return 5;
    } else {
      return ticksCount / 2;
    }
  }

  suggestIncreasedTicksCount(ticksCount: number): number {
    if (ticksCount < 5) {
      return ticksCount + 1;
    } else if (ticksCount == 5) {
      return 10;
    } else {
      return ticksCount * 2;
    }
  }
}
