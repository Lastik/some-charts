
import {FontHelper} from "../services";
import {LabelOptions, LabelOptionsDefaults} from "../options";
import * as $ from 'jquery'
import {IDisposable} from "../i-disposable";

export class Label implements IDisposable {

  private readonly containerElt: JQuery;

  private labelElt: JQuery | undefined;

  private options!: LabelOptions;

  /**
   * Creates new instance of Label.
   * @param {string} element - Container element where to create label.
   * @param {LegendOptions | undefined} options - Legend element display options.
   */
  constructor(element: string | HTMLDivElement, options?: LabelOptions) {

    let rootElt = $(element as any);

    if (!rootElt.length) {
      throw new Error(`Element with ${element as string} selector not found!`);
    }

    this.containerElt = $(element as any);

    this.options = LabelOptionsDefaults.Instance.extendWith(options);
    this.createLabelElt();
    this.applyStyleToLabelElt();
  }

  /**
   * Sets new options for the label.
   * @param {LegendOptions | undefined} options - Legend element display options.
   */
  setOptions(options?: LabelOptions) {
    this.options = LabelOptionsDefaults.Instance.extendWith(options);
    this.applyStyleToLabelElt();
  }

  private createLabelElt() {
    this.labelElt = $(`<label>${this.options.text}</label>`).addClass('sc-label');

    const containerEltId = this.containerElt.attr('id');

    if (containerEltId) {
      this.labelElt.attr('for', containerEltId!);
    }

    this.containerElt.append(this.labelElt);
  }

  private applyStyleToLabelElt(){
    this.labelElt?.
    css('font', FontHelper.fontToString(this.options?.font!))?.
    css('color', this.options.foregroundColor!.toString());
  }

  dispose(): void {
    this.labelElt?.remove();
  }
}
