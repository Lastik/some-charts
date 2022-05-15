/**
 * Provides methods with font interface.
 */
import {FontInUnits} from "../model/font/font-in-units";
import {FontInPx} from "../model/font/font-in-px";

export class FontHelper {
  public static fontToString(font: FontInUnits | FontInPx): string {
    let fontUnits = 'units' in font ? font.units : 'px';
    return `${font.size}${fontUnits} ${font.family}`;
  }
}
