import {Range} from '../range';

export abstract class Interpolation<InputType, OutputType> {
  inputRange: Range<InputType>;
  outputRange: Range<OutputType>;
  clippingOutputRange: Range<OutputType>

  constructor(inputRange: Range<InputType>, outputRange: Range<OutputType>, clippingOutputRange: Range<OutputType>) {
    this.inputRange = inputRange;
    this.outputRange = outputRange;
    this.clippingOutputRange = clippingOutputRange;
  }

  abstract apply(value: InputType): OutputType;
}
