import * as ColorObj from "color";
import {Lerp} from "./lerp";
import {NumericLerp} from "./numeric-lerp";
import {Color} from "../color";

export class ColorLerp implements Lerp<Color>{
  apply(start: Color, end: Color, weight: number): Color {

    const startObj = new ColorObj(start);
    const endObj = new ColorObj(end);

    let numericLerp = new NumericLerp();

    return new ColorObj({
      h: numericLerp.apply(startObj.hue(), endObj.hue(), weight),
      s: numericLerp.apply(startObj.saturationl(), endObj.saturationl(), weight),
      l: numericLerp.apply(startObj.lightness(), endObj.lightness(), weight),
      alpha: numericLerp.apply(startObj.alpha(), endObj.alpha(), weight),
    }).hex() as Color;
  }
}
