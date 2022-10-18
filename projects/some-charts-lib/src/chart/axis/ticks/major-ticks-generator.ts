import {Range} from "../../../index";
import { Tick } from "./tick";

export abstract class MajorTicksGenerator<T> {

  protected tickHeight: number;

  constructor(tickHeight: number) {
    this.tickHeight = tickHeight;
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
  suggestIncreasedTicksCount(ticksCount: number): number{
    if (ticksCount < 5) {
      return ticksCount + 1;
    } else if (ticksCount == 5) {
      return 10;
    } else {
      return ticksCount * 2;
    }
  }

  /**
   * Suggests decreased ticks count for specified ticks count.
   * @param {number} ticksCount - amount of ticks.
   * @return {number} - new ticks count
   * */
  suggestDecreasedTickCount(ticksCount: number): number{
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
}
