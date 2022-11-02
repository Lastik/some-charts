import {LegendOptions, LegendOptionsDefaults} from "../../index";
import {LegendItem, Size} from "../../index";
import * as Color from "color";
import * as $ from 'jquery'

export class Legend {

  private container: JQuery;
  private readonly uiElt: JQuery;

  private legendContainingElt: JQuery | undefined;

  private options: LegendOptions;

  /**
   * Creates new instance of Legend.
   * @param {string} elementSelector - Selector of HTML element where to create legend.
   * @param {Size} containerSize - Legend containing element size.
   * @param {LegendOptions | undefined} options - Legend element display options.
   */
  constructor(elementSelector: string, containerSize: Size, options?: LegendOptions) {

    let container = $(elementSelector);

    if (!container.length) {
      throw new Error(`Element with ${elementSelector} id not found!`);
    }

    this.container = container;

    this.uiElt = $('<div></div>');
    this.uiElt
      .width(containerSize.width)
      .height(containerSize.height)
      .css('position', 'absolute');

    container.append(this.uiElt);

    this.options = options ?? LegendOptionsDefaults.Instance;
  }

  /**
   * Shows legend, if it is hidden.
   */
  showLegend() {
    this.legendContainingElt?.show();
  }

  /**
   * Hides legend, if it is shown.
   */
  hideLegend() {
    this.legendContainingElt?.hide();
  }

  /**
   * Updates legend's content.
   * @param {Array<LegendItem>} legendItems - items to be shown on legend.
   */
  updateContent(legendItems: Array<LegendItem>) {
    if (!this.legendContainingElt) {
      this.legendContainingElt = $('<div></div>').
        css('padding', '0.5em').
        css('position', 'absolute').
        addClass('ui-widget-content');

      this.legendContainingElt.
        css('right', '0px').
        css('margin-right', this.options.offsetRight).
        css('margin-top', this.options.offsetTop).
        css('opacity', this.options.opacity).
        css('font-size', this.options.fontSize);

      this.uiElt.append(this.legendContainingElt);
      this.legendContainingElt.hide();
    }

    this.legendContainingElt.empty();

    let legendTable = $('<table></table>');
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
      let nameDiv = $('<div>' + legendItem.id + '</div>');
      nameColumn.append(nameDiv);

      let row = $('<tr></tr>');
      row.append(colorColumn);
      row.append(nameColumn);
      legendTable.append(row);
    }

    this.legendContainingElt.append(legendTable);
  }
}
