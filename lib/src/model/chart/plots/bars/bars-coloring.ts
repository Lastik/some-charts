import * as Color from "color";
import {Range} from "../../../geometry";

export class BarsColoring {
  readonly fillGradient: Range<Color>;
  readonly stroke: Color;

  /**
   * Represents set of color, used for coloring bars.
   * @param {Range<Color>} fillGradient - Fill gradient range
   * @param {Color} stroke - Stroke color
   * */
  constructor(fillGradient: Range<Color>, stroke: Color) {
    this.fillGradient = fillGradient;
    this.stroke = stroke;
  }
}
