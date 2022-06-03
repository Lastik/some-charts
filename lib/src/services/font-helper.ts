/**
 * Provides methods with font interface.
 */
import {FontInUnits, FontInPx} from "../model";

export class FontHelper {
  public static fontToString(font: FontInUnits | FontInPx): string {
    let fontUnits = 'units' in font ? font.units : 'px';
    return `${font.size}${fontUnits} ${font.family}`;
  }
}
