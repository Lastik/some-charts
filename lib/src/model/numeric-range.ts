import {Range} from "./range"

export class NumericRange extends Range<number> {
  constructor(min: number, max: number, isEmpty: boolean) {
    super(min, max, isEmpty);
  }

  public getLength() {
    return this.max - this.min;
  }
}
