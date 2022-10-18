import * as moment from "moment";
import {MajorTimeUnitTicksGenerator} from "../major-time-unit-ticks-generator";
import {TimeUnit} from "../time-unit";

export class MajorMinutesTicksGenerator extends MajorTimeUnitTicksGenerator {

  constructor(majorTickHeight: number) {
    super(majorTickHeight);
  }

  protected getTimeUnitValueAsString(date: moment.Moment, detailed: boolean): string {
    if (detailed) {
      return date.format('MMMM Do YYYY, H:mm');
    }
    return date.hours().toString() + 'M';
  }

  get timeUnit(): TimeUnit {
    return 'minutes';
  }
}
