import {DataRect} from "../geometry";

export interface ChartView {
  get visibleRect(): DataRect;
  update(visibleRect: DataRect): void;
  fitToView(): void;
}
