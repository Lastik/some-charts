import * as moment from "moment";
import {MajorTimeUnitTicksGenerator} from "../major-time-unit-ticks-generator";
import {TimeUnit} from "../time-unit";

export class MajorHoursTicksGenerator extends MajorTimeUnitTicksGenerator {

  constructor(majorTickHeight: number, detailed: boolean) {
    super(majorTickHeight, detailed);
  }

  protected getTimeUnitValueAsString(date: moment.Moment, detailed: boolean): string {
    if (detailed) {
      return date.format('MMMM Do YYYY, H[H]');
    }
    return date.hours().toString() + 'H';
  }

  get timeUnit(): TimeUnit {
    return 'hours';
  }
}
