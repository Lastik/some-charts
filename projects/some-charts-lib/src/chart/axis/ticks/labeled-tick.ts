import {Tick} from "./tick";

export class LabeledTick<T = number> extends Tick<T>{
  label: string;

  constructor(value: T, length: number, index: number, label: string) {
    super(value, length, index);
    this.label = label;
  }

  override toString(): string{
    return this.label;
  }
}
