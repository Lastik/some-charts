import * as Color from "color";
import {Lerp} from "./lerp";

export class ColorLerp {
  static apply(start: Color, end: Color, weight: number = 0.5): Color {
    return new Color({
      h: Lerp.apply(start.hue(), end.hue(), weight),
      s: Lerp.apply(start.saturationl(), end.saturationl(), weight),
      l: Lerp.apply(start.lightness(), end.lightness(), weight),
      alpha: Lerp.apply(start.alpha(), end.alpha(), weight),
    });
  }
}
