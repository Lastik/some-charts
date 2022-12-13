import Konva from "konva";
import merge from "lodash-es/merge";
import {ChartRenderableItem} from "./chart-renderable-item";
import {NumericPoint, Size} from "../geometry";
import {GridOptions, GridOptionsDefaults} from "../options";
import {MathHelper} from "../services";
import {LayerId} from "../layer-id";
import {cloneDeep} from "lodash-es";

export class Grid extends ChartRenderableItem<Konva.Shape> {

  protected layerId: string;

  private location: NumericPoint;
  private size: Size;

  protected horizontalLinesCoords: number[];
  protected verticalLinesCoords: number[];

  private compositeShape: Konva.Shape;
  private borderShape: Konva.Shape;

  private options: GridOptions;

  /**
   * Creates new instance of grid. Grid is grid net on chart's plot area.
   * @param {NumericPoint} location - Grid location on renderer.
   * @param {Size} size - Grid size.
   * @param {GridOptions} options - Grid options object.
   */
  constructor(location: NumericPoint, size: Size, options?: GridOptions) {
    super();
    this.location = location;
    this.size = size;

    this.options = GridOptionsDefaults.Instance.extendWith(options);

    this.horizontalLinesCoords = [];
    this.verticalLinesCoords = [];

    let grid = this;

    this.compositeShape = new Konva.Shape({
      location: grid.location,
      size: grid.size,
      horizontalLinesCoords: grid.horizontalLinesCoords,
      verticalLinesCoords: grid.verticalLinesCoords,
      sceneFunc: function (context, shape) {

        context.save();

        context.setAttr('fillStyle', grid.options.backgroundColor);
        context.setAttr('strokeStyle', grid.options.foregroundColor);
        context.setAttr('lineWidth', 0.5);

        let horizontalLines = grid.horizontalLinesCoords;
        let verticalLines = grid.verticalLinesCoords;

        let location = grid.location;
        let size = grid.size;

        let width = size.width;
        let height = size.height;

        context.save();
        context.beginPath();
        context.rect(location.x, location.y, width, height);
        context.clip();

        if (horizontalLines != null) {
          for (let i = 0; i < horizontalLines.length; i++) {
            let tick = horizontalLines[i];

            let start = new NumericPoint(
              MathHelper.optimizeValue(location.x),
              MathHelper.optimizeValue(location.y + tick));

            let stop = new NumericPoint(
              MathHelper.optimizeValue(location.x + size.width),
              MathHelper.optimizeValue(location.y + tick));

            context.moveTo(start.x, start.y);
            context.lineTo(stop.x, stop.y);
          }
        }

        if (verticalLines != null) {
          for (let i = 0; i < verticalLines.length; i++) {
            let tick = verticalLines[i];

            let start = new NumericPoint(
              MathHelper.optimizeValue(location.x + tick),
              MathHelper.optimizeValue(location.y));

            let stop = new NumericPoint(
              MathHelper.optimizeValue(location.x + tick),
              MathHelper.optimizeValue(location.y + size.height));

            context.moveTo(start.x, start.y);
            context.lineTo(stop.x, stop.y);
          }
        }

        context.stroke();
        context.restore();
      }
    });

    this.borderShape = new Konva.Shape({
      location: grid.location,
      size: grid.size,
      sceneFunc: function (context, shape) {

        context.save();

        context.setAttr('fillStyle', grid.options.backgroundColor);
        context.setAttr('strokeStyle', grid.options.foregroundColor);
        context.setAttr('lineWidth', 1);

        let location = grid.location;
        let size = grid.size;
        context.strokeRect(location.x, location.y, size.width, size.height);
        context.fillRect(location.x, location.y, size.width, size.height);

        context.restore();
      }
    });

    this.layerId = LayerId.Chart;
    this.konvaDrawables = [this.borderShape, this.compositeShape];
  }

  /**
   * Uprates grid's state.
   * @param {NumericPoint} location - Grid location on renderer.
   * @param {Size} size - Grid size.
   */
  update(location: NumericPoint, size: Size) {
    this.location = location;
    this.size = size;
    this.updateGridShapes();
  }

  /**
   * Uprates grid's horizontal and vertical lines.
   * @param {Array<number>} horizontalLinesCoords - Grid's horizontal lines Y coordinates.
   * @param {Array<number>} verticalLinesCoords - Grid's vertical lines X coordinates.
   * */
  setLinesCoords(horizontalLinesCoords: Array<number>,
                 verticalLinesCoords: Array<number>) {
    this.horizontalLinesCoords = horizontalLinesCoords;
    this.verticalLinesCoords = verticalLinesCoords;
    this.updateGridShapes();
  }

  private updateGridShapes() {
    this.compositeShape.setAttrs({
      location: this.location,
      size: this.size,
      horizontalLinesCoords: this.horizontalLinesCoords,
      verticalLinesCoords: this.verticalLinesCoords
    });

    this.borderShape.setAttrs({
      location: this.location,
      size: this.size
    });
  }
}
