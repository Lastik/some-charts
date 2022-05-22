export class Range<T> {

  readonly min: T;
  readonly max: T;

  constructor(min: T, max: T) {
    this.min = min;
    this.max = max;
  }

  public isPoint() {
    return this.max == this.min;
  }
}
