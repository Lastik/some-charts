import {Range} from "../../../model/range";
import { Tick } from "./tick";

export interface MajorTicksGenerator<T> {

  get defaultTicksCount(): number;

  /**
   * Generates ticks in specified range.
   * @param {Range} range - data range.
   * @param {number} ticksCount - amount of ticks in specified range
   * @return {Array<Tick>} - array of generated ticks
   * */
  generateTicks(range: Range<T>, ticksCount: number): Array<Tick<T>>;

  /**
  * Suggests increased ticks count for specified ticks count.
  * @param {number} ticksCount - amount of ticks.
   * @return {number} - new ticks count
  * */
  suggestIncreasedTicksCount(ticksCount: number): number;

  /**
   * Suggests decreased ticks count for specified ticks count.
   * @param {number} ticksCount - amount of ticks.
   * @return {number} - new ticks count
   * */
  suggestDecreasedTickCount(ticksCount: number): number;
}
