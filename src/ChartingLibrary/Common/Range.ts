export class Range {

  private min: number;
  private max: number;
  private empty: boolean;

  constructor(min: number, max: number, empty: boolean) {
    this.min = min;
    this.max = max;
    this.empty = !!empty;
  }

  private static emptyRangeVal: Range = new Range(0, 0, true);

  public static emptyRange(): Range {
    return Range.emptyRangeVal;
  }

  public isEmpty() {
    return this.empty;
  }

  public getMin() {
    return this.min;
  }

  public getMax() {
    return this.max;
  }

  public isPoint() {
    return this.max == this.min;
  }

  public getLength() {
    return this.max - this.min;
  }
}
