import * as Color from "color";
import {Lerp} from "./lerp";
import {NumericLerp} from "./numeric-lerp";

export class ColorLerp implements Lerp<Color>{
  apply(start: Color, end: Color, weight: number): Color {

    let numericLerp = new NumericLerp();

    return new Color({
      h: numericLerp.apply(start.hue(), end.hue(), weight),
      s: numericLerp.apply(start.saturationl(), end.saturationl(), weight),
      l: numericLerp.apply(start.lightness(), end.lightness(), weight),
      alpha: numericLerp.apply(start.alpha(), end.alpha(), weight),
    });
  }
}
