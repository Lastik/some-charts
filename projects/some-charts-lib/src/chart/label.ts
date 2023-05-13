
import {FontHelper} from "../services";
import {LabelOptions, LabelOptionsDefaults} from "../options";
import * as $ from 'jquery'

export class Label {

  private readonly containerElt: JQuery;

  private labelElt: JQuery | undefined;

  private options: LabelOptions;

  /**
   * Creates new instance of Label.
   * @param {string} elementSelector - Selector of HTML element where to create label.
   * @param {LegendOptions | undefined} options - Legend element display options.
   */
  constructor(elementSelector: string, options?: LabelOptions) {

    let rootElt = $(elementSelector);

    if (!rootElt.length) {
      throw new Error(`Element with ${elementSelector} selector not found!`);
    }

    this.containerElt = $(elementSelector);
    this.options = LabelOptionsDefaults.Instance.extendWith(options);

    this.createLabel();
  }

  private createLabel() {
    this.labelElt = $(`<label>${this.options.text}</label>`).
      addClass('sc-label');

    const containerEltId = this.containerElt.attr('id');

    if(containerEltId){
      this.labelElt.attr('for', containerEltId!);
    }

    this.labelElt.
      css('font', FontHelper.fontToString(this.options?.font!)).
      css('color', this.options.foregroundColor!.toString());

    this.containerElt.append(this.labelElt);
  }
}
