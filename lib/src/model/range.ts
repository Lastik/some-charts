export class Range<T> {

  readonly min: T;
  readonly max: T;
  readonly isEmpty: boolean;

  constructor(min: T, max: T, isEmpty: boolean) {
    this.min = min;
    this.max = max;
    this.isEmpty = !!isEmpty;
  }

  public isPoint() {
    return this.max == this.min;
  }
}
