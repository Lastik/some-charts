export class Range<T> {

  constructor(readonly min: T, readonly max: T) {
    this.min = min;
    this.max = max;
  }

  public isPoint() {
    return this.max === this.min;
  }
}
