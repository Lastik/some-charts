/**
 * Provides methods with font interface.
 */
import {FontInUnits, FontInPx} from "../index";

export class FontHelper {
  public static fontToString(font: FontInUnits | FontInPx): string {
    let fontUnits = 'units' in font ? font.units : 'px';
    return `${font.size}${fontUnits} ${font.family}`;
  }
}
