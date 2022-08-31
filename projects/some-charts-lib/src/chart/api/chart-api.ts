import {DataRect, Size} from "../../geometry";
import {Renderer} from "../../renderer";

export interface ChartApi<ChartContentItemType> {
  get id(): number;

  addContentItem(contentItem: ChartContentItemType): void;

  removeContentItem(contentItem: ChartContentItemType): void;

  get visibleRect(): DataRect;

  update(visibleRect: DataRect): void;

  fitToView(): void;

  getPlotSize(): Size;

  getRenderer(): Renderer;

  get minZoomLevel(): number;
}
