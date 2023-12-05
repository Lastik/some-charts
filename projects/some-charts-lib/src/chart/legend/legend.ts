import {LegendOptions, LegendOptionsDefaults} from "../../index";
import {LegendItem} from "../../index";
import {Color} from "../../color";
import * as $ from 'jquery'
import {isString} from "lodash-es";

export class Legend {

  private readonly containerElt: JQuery;

  private legendElt: JQuery | undefined;

  private options: LegendOptions;

  /**
   * Creates new instance of Legend.
   * @param {string} element - Container element where to create legend.
   * @param {LegendOptions | undefined} options - Legend element display options.
   */
  constructor(element: string | HTMLDivElement, options?: LegendOptions) {

    let rootElt = $(element as any);

    if (!rootElt.length) {
      throw new Error(`Element with ${element as string} id not found!`);
    }

    this.containerElt = $(element as any);
    this.options = LegendOptionsDefaults.Instance.extendWith(options);
  }

  /**
   * Shows legend, if it is hidden.
   */
  showLegend() {
    this.legendElt?.show();
  }

  /**
   * Hides legend, if it is shown.
   */
  hideLegend() {
    this.legendElt?.hide();
  }

  /**
   * Updates legend's content.
   * @param {Array<LegendItem>} legendItems - items to be shown on legend.
   */
  updateContent(legendItems: Array<LegendItem>) {
    if (!this.legendElt) {
      this.legendElt = $('<div></div>').
        addClass('sc-legend');

      this.legendElt.
        css('font-size', this.options.fontSize!);

      this.containerElt.append(this.legendElt);
    }

    this.legendElt.empty();

    for (let legendItem of legendItems) {

      let legendItemElt = $('<div class="sc-legend-item"></div>');

      let colorDiv = $('<div class="sc-legend-item__color"></div>');

      colorDiv.
        width(this.options.rectangleSize!).
        height(this.options.rectangleSize!);

      if(isString(legendItem.color)){
        colorDiv.css('background-color', legendItem.color)
      }
      else if (legendItem.color.metricId && legendItem.color.range){
        colorDiv.css('background', `linear-gradient(to right, ${legendItem.color.range.min.toString()}, ${legendItem.color.range.max.toString()}`);
      }

      legendItemElt.append(colorDiv);

      let nameDiv = $('<div class="sc-legend-item__caption">' + legendItem.caption + '</div>').
        css('color', this.options.foregroundColor!);

      legendItemElt.append(nameDiv);

      this.legendElt.append(legendItemElt)
    }
  }
}
