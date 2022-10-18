import {Range} from "../../../index";
import { Tick } from "./tick";

export interface MinorTicksGenerator<DataType, TickType = DataType> {
  /**
   * Generates minor ticks in specified range.
   * @param {Range} range - data range.
   * @param {Array<Tick>} majorTicks - array of major ticks in specified range.
   * @return {Array<Tick>} - array of generated ticks
   * */
  generateMinorTicks(range: Range<DataType>, majorTicks: Array<Tick<TickType>>): Array<Tick<TickType>>;
}
