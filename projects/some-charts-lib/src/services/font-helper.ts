/**
 * Provides methods with font interface.
 */
import {FontInUnits, FontInPx} from "../index";

class FontHelper {
  public fontToString(font: FontInUnits | FontInPx): string {
    let fontUnits = 'units' in font ? font.units : 'px';
    return `${font.size}${fontUnits} ${font.family}`;
  }
}

const fontHelper = new FontHelper();

export {fontHelper as FontHelper};
