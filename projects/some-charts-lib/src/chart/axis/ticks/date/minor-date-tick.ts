import {LabeledTick} from "../labeled-tick";

type TickLevel =  1 | 2;
type TickAlignment = 'left' | 'middle' | 'right';

export class MinorDateTick extends LabeledTick<Date> {

  level: TickLevel;
  alignment: TickAlignment;

  constructor(value: Date, length: number, index: number, label: string, level: TickLevel, alignment: TickAlignment) {
    super(value, length, index, label);
    this.level = level;
    this.alignment = alignment;
  }
}
