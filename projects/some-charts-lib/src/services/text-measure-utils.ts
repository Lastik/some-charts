import Konva from "konva";
import Util = Konva.Util;
import {FontInUnits, FontInPx} from "../font";
import {Size} from "../geometry";
import {FontHelper} from "./font-helper";

class TextMeasureUtils {

  private readonly dummyContext: CanvasRenderingContext2D;

  /**
   * Provides text measuring utilities methods.
   */
  constructor() {
    let CONTEXT_2D = '2d';
    this.dummyContext = <CanvasRenderingContext2D>Util.createCanvasElement().getContext(CONTEXT_2D)!;
  }

  /**
   * Measures text height for specified font.
   * @param {String} font - text font.
   * @returns {number}
   */
  public measureTextHeight(font: string) {
    let context = this.dummyContext;
    context.font = font;
    return context.measureText("m").width * 1.05;
  }

  /**
   * Measures font height in pixels.
   * @param {FontInUnits | FontInPx} font - text font.
   * @returns {number}
   */
  public measureFontHeight(font: FontInUnits | FontInPx) {
    return this.measureTextHeight(FontHelper.fontToString(font));
  }

  /**
   * Measures text width for specified font.
   * @param {String} font - text font.
   * @param {String} text - text to measure
   * @returns {number}
   */
  public measureTextWidth(font: string, text: string) {
    let context = this.dummyContext;
    context.font = font;
    return context.measureText(text).width;
  }

  /**
   * Measures text size for specified font.
   * @param {FontInUnits | FontInPx} font - text font.
   * @param {String} text - text to measure
   * @returns {Size}
   */
  public measureTextSize(font: FontInUnits | FontInPx, text: string) {

    let fontStr = FontHelper.fontToString(font);

    return new Size(
      this.measureTextWidth(fontStr, text),
      this.measureTextHeight(fontStr))
  }
}

const textMeasureUtils = new TextMeasureUtils();

export {textMeasureUtils as TextMeasureUtils};
