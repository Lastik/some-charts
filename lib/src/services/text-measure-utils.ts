/**
 * Provides text measuring utilities methods.
 */
import Konva from "konva";
import Util = Konva.Util;
import {FontInUnits} from "../model/font/font-in-units";
import {FontInPx} from "../model/font/font-in-px";
import {FontHelper} from "./font-helper";

export class TextMeasureUtils {

  static dummyContext: CanvasRenderingContext2D;

  private static getDummyContext(): CanvasRenderingContext2D {
    if (TextMeasureUtils.dummyContext) {
      return TextMeasureUtils.dummyContext;
    }
    let CONTEXT_2D = '2d';
    TextMeasureUtils.dummyContext = <CanvasRenderingContext2D>Util.createCanvasElement().getContext(CONTEXT_2D)!;
    return TextMeasureUtils.dummyContext;
  }

  /**
   * Measures vertical offset for the text for specified font.
   * @param {String} font - text font.
   * @returns {number}
   */
  public static measureTextVerticalOffsetHeight(font: string) {
    let context = TextMeasureUtils.getDummyContext();
    context.font = font;
    return context.measureText("m").width * 0.225;
  }

  /**
   * Measures text height for specified font.
   * @param {String} font - text font.
   * @returns {number}
   */
  public static measureTextHeight(font: string) {
    let context = TextMeasureUtils.getDummyContext();
    context.font = font;
    return context.measureText("m").width * 1.05;
  }

  /**
   * Measures font height in pixels.
   * @param {FontInUnits | FontInPx} font - text font.
   * @returns {number}
   */
  public static measureFontHeight(font: FontInUnits | FontInPx) {
    return TextMeasureUtils.measureTextHeight(FontHelper.fontToString(font));
  }

  /**
   * Measures text width for specified font.
   * @param {String} font - text font.
   * @param {String} text - text to measure
   * @returns {number}
   */
  public static measureTextWidth(font: string, text: string) {
    let context = TextMeasureUtils.getDummyContext();
    context.font = font;
    return context.measureText(text).width;
  }
}
