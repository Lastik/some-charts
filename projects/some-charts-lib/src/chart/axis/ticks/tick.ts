
export class Tick<T extends Object> {
  value: T;
  length: number;
  index: number;

  constructor(value: T, length: number, index: number) {
    this.value = value;
    this.length = length;
    this.index = index;
  }

  toString(): string{
    return this.value.toString();
  }
}
