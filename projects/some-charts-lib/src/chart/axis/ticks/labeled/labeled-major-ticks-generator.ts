import {Tick} from "../tick";
import {Point, Range} from "../../../../index"
import {MajorTicksGenerator} from "../major-ticks-generator";
import {LabeledTick} from "../labeled-tick";
import {filter, flow, partialRight} from "lodash-es";
import map from "lodash-es/map";

export class LabeledMajorTicksGenerator extends MajorTicksGenerator<number> {

  private labels: Array<Point<string>>;

  constructor(majorTickHeight: number, labels: Array<Point<string>>) {
    super(majorTickHeight);
    this.labels = labels;
  }

  override get defaultTicksCount(): number {
    return this.labels.length;
  }

  generateTicks(range: Range<number>, ticksCount: number): Array<Tick<number>> {
    return flow(
      partialRight(filter, ((label: Point<string>) => {
        return label.y >= range.min && label.y <= range.max;
      })),
      partialRight(map, (label: Point<string>, index: number) => {
          return new LabeledTick(label.y, this.majorTickHeight, index, label.x);
        }
      ))(this.labels);
  }

  override suggestDecreasedTickCount(ticksCount: number): number {
    return ticksCount;
  }

  override suggestIncreasedTicksCount(ticksCount: number): number {
    return ticksCount;
  }

  setLabels(labels: Array<Point<string>>) {
    this.labels = labels;
  }
}
