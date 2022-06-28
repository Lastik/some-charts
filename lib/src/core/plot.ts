import {ChartRenderableItem} from "./chart-renderable-item";
import {LayerName} from "./layer-name";

export abstract class Plot extends ChartRenderableItem {
    getDependantLayers(): string[] {
        return [LayerName.Chart];
    }
}
