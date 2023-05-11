/**
 * Helps to operate with jquery objects.
 */
class JqueryHelper {

  private idCounter = 0;

  /**
   * Sets unique ID for the jquery element.
   * @param {JQuery<HTMLElement>} element - Jquery element.
   * @returns {JQuery<HTMLElement>}
   */
  public setUniqueID(element: JQuery<HTMLElement>): JQuery<HTMLElement> {

    let uniqueEltId = 'ace-' + this.idCounter++

    return element.attr('id', uniqueEltId);
  }
}

const jqueryHelper = new JqueryHelper();

export {jqueryHelper as JqueryHelper};
