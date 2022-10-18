import * as moment from "moment";
import {MajorTimeUnitTicksGenerator} from "../major-time-unit-ticks-generator";
import {TimeUnit} from "../time-unit";

export class MajorDaysTicksGenerator extends MajorTimeUnitTicksGenerator {

  constructor(majorTickHeight: number, detailed: boolean) {
    super(majorTickHeight, detailed);
  }

  protected getTimeUnitValueAsString(date: moment.Moment, detailed: boolean): string {
    if (detailed) {
      return date.format('MMMM Do');
    }
    return date.format('Do');
  }

  get timeUnit(): TimeUnit {
    return 'days';
  }
}
