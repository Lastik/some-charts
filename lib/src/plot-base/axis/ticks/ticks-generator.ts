import {Range} from "../../../model/range";
import { Tick } from "./tick";

export interface TicksGenerator<T> {


  /// <summary>Generates ticks in specified range.</summary>
  /// <param name="range" type="Range">Range, between which to generate ticks.</param>
  /// <param name="ticksCount" type="Number">Number of ticks to generate.</param>


  /**
   *
   * */
  generateTicks(range: Range<T>, ticksCount: number): Array<Tick<T>>;

  suggestIncreasedTicksCount(ticksCount: number): number;

  suggestDecreasedTickCount(ticksCount: number): number;
}
