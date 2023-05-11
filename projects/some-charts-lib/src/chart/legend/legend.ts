import {LegendOptions, LegendOptionsDefaults} from "../../index";
import {LegendItem} from "../../index";
import * as Color from "color";
import * as $ from 'jquery'

export class Legend {

  private readonly containerElt: JQuery;

  private legendElt: JQuery | undefined;

  private options: LegendOptions;

  /**
   * Creates new instance of Legend.
   * @param {string} elementSelector - Selector of HTML element where to create legend.
   * @param {LegendOptions | undefined} options - Legend element display options.
   */
  constructor(elementSelector: string, options?: LegendOptions) {

    let rootElt = $(elementSelector);

    if (!rootElt.length) {
      throw new Error(`Element with ${elementSelector} id not found!`);
    }

    this.containerElt = $(elementSelector);
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
        addClass('fac-legend');

      this.legendElt.
        css('margin-right', this.options.offsetRight).
        css('margin-top', this.options.offsetTop).
        css('opacity', this.options.opacity).
        css('font-size', this.options.fontSize);

      this.containerElt.append(this.legendElt);
    }

    this.legendElt.empty();

    let legendTable = $('<table class="fac-legend__table"></table>');
    for (let legendItem of legendItems) {

      let colorColumn = $('<td></td>');
      let colorDiv = $('<div></div>');

      colorDiv.
        width(this.options.rectangleSize).
        height(this.options.rectangleSize);

      if(legendItem.color instanceof Color){
        colorDiv.css('background-color', legendItem.color.toString())
      }
      else if (legendItem.color.metricId && legendItem.color.range){
        colorDiv.css('background', `linear-gradient(to right, ${legendItem.color.range.min.toString()}, ${legendItem.color.range.max.toString()}`);
      }

      colorColumn.append(colorDiv);

      let nameColumn = $('<td></td>');
      let nameDiv = $('<div>' + legendItem.caption + '</div>');
      nameColumn.append(nameDiv);

      let row = $('<tr></tr>');
      row.append(colorColumn);
      row.append(nameColumn);
      legendTable.append(row);
    }

    this.legendElt.append(legendTable);
  }
}
