import * as Color from "color";
import {MetricDependantValue} from "./metric-dependant-value";
import {Range} from "../../../geometry";

/**
 * Represents color palette
 */
export class Palette implements MetricDependantValue<Color> {
  readonly metricName: string;
  readonly range: Range<Color>;

  constructor(metricName: string, range: Range<Color>) {
    this.metricName = metricName;
    this.range = range;
  }
}
