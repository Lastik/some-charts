/**
 * Helps to operate with jquery objects.
 */
export class JqueryHelper {

  private static IdCounter = 0;

  /**
   * Sets unique ID for the jquery element.
   * @param {JQuery<HTMLElement>} element - Jquery element.
   * @returns {JQuery<HTMLElement>}
   */
  public static setUniqueID(element: JQuery<HTMLElement>): JQuery<HTMLElement> {

    let uniqueEltId = 'ace-' + JqueryHelper.IdCounter++

    return element.attr('id', uniqueEltId);
  }
}
