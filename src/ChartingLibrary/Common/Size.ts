export class Size {

  /**
   * Size width param.
   */
  readonly width: number;

  /**
   * Size height param.
   */
  readonly height: number;

  /**
   * Creates Size of specified with and height.
   * @param {number} width - Size width param.
   * @param {number} height - Size height param.
   */
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}
