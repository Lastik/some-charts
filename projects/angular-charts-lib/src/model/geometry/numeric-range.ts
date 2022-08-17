import {Range} from "./range"

export class NumericRange extends Range<number> {
  constructor(min: number, max: number) {
    super(min, max);
  }

  public getLength() {
    return this.max - this.min;
  }

  public withShift(offset: number): NumericRange {
    return new NumericRange(this.min + offset, this.max + offset)
  }
}
