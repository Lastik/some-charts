import {ChartRenderableItem} from "./chart-renderable-item";

export interface ChartContentPlaceholder {

  get id(): number;

  addContentItem(contentItem: ChartRenderableItem): void;

  removeContentItem(contentItem: ChartRenderableItem): void;
}
