import {Renderer} from "../core/renderer";
import {ChartElement} from "../core/chart-element";
import Konva from "konva";

export class Chart {
  private renderer?: Renderer;
  private _chartElements: Array<ChartElement>;

  constructor() {
    this._chartElements = [];
  }

  getRenderer(): Renderer | undefined {
    return this.renderer;
  };

  attachTo(renderer: Renderer){
    this.renderer = renderer;
  }

  detach(){
    this.renderer = undefined;
  }

  get chartElements(): Array<ChartElement> {
    return this._chartElements;
  }

  /**
   * Adds specified chart element to chart.
   * @param {ChartElement} element - Element to add to chart.
   */
  add(element: ChartElement) {
    this._chartElements.push(element);
    element.attach(this);
  }

  /**
   * Removes specified chart element from chart.
   * @param {ChartElement} element - Element to remove.
   */
  remove(element: ChartElement) {
    let ind = this._chartElements.indexOf(element);
    this._chartElements.splice(ind, 1);

    element.detach();

    for (let layerName of element.getDependantLayers()) {
      this.renderer?.getStage().findOne(layerName).draw();
    }
  }

  getChartLayer(): Konva.Layer | undefined {
    return this.renderer?.getStage().findOne('chartLayer');
  }
}
