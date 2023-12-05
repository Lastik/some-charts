import {MetricDependantValue} from "./metric-dependant-value";
import {Range} from "../../../geometry";
import {Color} from "../../../color";

/**
 * Represents color palette
 */
export class Palette implements MetricDependantValue<Color> {
  readonly metricId: string;
  readonly range: Range<Color>;

  constructor(metricId: string, range: Range<Color>) {
    this.metricId = metricId;
    this.range = range;
  }
}
