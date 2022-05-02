import {Size} from "../model/size";
import {RenderableItem} from "./renderable-item";
import {EventUtils} from "../services/event-utils";
import {ACEventTarget} from "../model/events/a-c-event-target";
import {UagentUtils} from "../services/uagent-utils";
import {RendererOptionsDefaults} from "../options/renderer-options";
import {ChartOptions, ChartOptionsDefaults} from "../options/chart-options";
import {JqueryHelper} from "../services/jquery-helper";
import Konva from "konva";

export class LegendController {

  private container: JQuery;
  private uiElt: JQuery;

  /**
   * Creates new instance of LegendController.
   * @param {string} elementID - ID of HTML element where to create renderer.
   */
  constructor(elementID: string, size: Size) {

    let container = $(elementID);

    if (!container.length) {
      throw new Error(`Element with ${elementID} id not found!`);
    }

    this.container = container;

    this.uiElt = $('<div></div>');
    this.uiElt
      .width(size.width)
      .height(size.height)
      .css('position', 'absolute');

    container.append(this.uiElt);
  }
}
