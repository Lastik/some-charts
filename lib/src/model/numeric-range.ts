import {Range} from "./range"

export class NumericRange extends Range<number> {
  constructor(min: number, max: number) {
    super(min, max);
  }

  public getLength() {
    return this.max - this.min;
  }
}
