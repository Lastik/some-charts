import {Tick} from "./tick";

export class LabeledTick extends Tick<number>{
  label: string;

  constructor(value: number, length: number, index: number, label: string) {
    super(value, length, index);
    this.label = label;
  }

  override toString(): string{
    return this.label;
  }
}
