import {Tick} from "../tick";
import {Range} from "../../../../model/range"
import {MajorTicksGenerator} from "../major-ticks-generator";
import {StringPoint} from "../../../../model/point/string-point";
import chain from "lodash-es/chain";
import {LabeledTick} from "../labeled-tick";

export class LabeledMajorTicksGenerator implements MajorTicksGenerator<number> {

  protected majorTickHeight: number;
  private labels: Array<StringPoint>;

  constructor(majorTickHeight: number, labels: Array<StringPoint>) {
    this.majorTickHeight = majorTickHeight;
    this.labels = labels;
  }

  get defaultTicksCount(): number {
    return this.labels.length;
  }

  generateTicks(range: Range<number>, ticksCount: number): Array<Tick<number>> {
    return chain(this.labels).filter(label => {
      return label.y >= range.min && label.y <= range.max;
    }).map((label, index) => {
      return new LabeledTick(label.y, this.majorTickHeight, index, label.x);
    }).value();
  }

  suggestDecreasedTickCount(ticksCount: number): number {
    return ticksCount;
  }

  suggestIncreasedTicksCount(ticksCount: number): number {
    return ticksCount;
  }
}
