/**
 * Provides text measuring utilities methods.
 */
export class TextMeasureUtils {

  /**
   * Measures vertical offset for the text for specified font.
   * @param {CanvasRenderingContext2D} context - Render context.
   * @param {String} font - text font.
   * @returns {number}
   */
  public static measureTextVerticalOffsetHeight(context: CanvasRenderingContext2D, font: string) {
    context.font = font;
    return context.measureText("m").width * 0.225;
  }

  /**
   * Measures text height for specified font.
   * @param {CanvasRenderingContext2D} context - Render context.
   * @param {String} font - text font.
   * @returns {number}
   */
  public static measureTextHeight(context: CanvasRenderingContext2D, font: string) {
    context.font = font;
    return context.measureText("m").width * 1.05;
  }
}
