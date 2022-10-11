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
