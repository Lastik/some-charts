import {Range} from "../../index";
import { Tick } from "./tick";

export abstract class MajorTicksGenerator<T> {

  protected majorTickHeight: number;

  constructor(majorTickHeight: number) {
    this.majorTickHeight = majorTickHeight;
  }

  get defaultTicksCount(): number{
    return 10;
  }

  /**
   * Generates ticks in specified range.
   * @param {Range} range - data range.
   * @param {number} ticksCount - amount of ticks in specified range
   * @return {Array<Tick>} - array of generated ticks
   * */
  abstract generateTicks(range: Range<T>, ticksCount: number): Array<Tick<T>>;

  /**
  * Suggests increased ticks count for specified ticks count.
  * @param {number} ticksCount - amount of ticks.
   * @return {number} - new ticks count
  * */
  abstract suggestIncreasedTicksCount(ticksCount: number): number;

  /**
   * Suggests decreased ticks count for specified ticks count.
   * @param {number} ticksCount - amount of ticks.
   * @return {number} - new ticks count
   * */
  abstract suggestDecreasedTickCount(ticksCount: number): number;
}
