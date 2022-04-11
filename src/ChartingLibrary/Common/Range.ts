export class Range {

  readonly min: number;
  readonly max: number;
  readonly isEmpty: boolean;

  constructor(min: number, max: number, isEmpty: boolean) {
    this.min = min;
    this.max = max;
    this.isEmpty = !!isEmpty;
  }

  private static emptyRangeVal: Range = new Range(0, 0, true);

  public static emptyRange(): Range {
    return Range.emptyRangeVal;
  }

  public isPoint() {
    return this.max == this.min;
  }

  public getLength() {
    return this.max - this.min;
  }
}
