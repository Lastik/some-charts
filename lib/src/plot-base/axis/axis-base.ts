import {NumericPoint} from "../../model/point/numeric-point";
import {Range} from "../../model/range";
import {Size} from "../../model/size";
import {AxisOptions, AxisOptionsDefaults} from "../../options/axis-options";
import Konva from "konva";
import {MathHelper} from "../../services/math-helper";
import {ChartRenderableItem} from "../../core/chart-renderable-item";
import {Chart} from "../chart";
import {CoordinateTransform} from "../../services/coordinate-transform";
import {TextMeasureUtils} from "../../services/text-measure-utils";
import {FontHelper} from "../../services/font-helper";

export abstract class AxisBase extends ChartRenderableItem {
  /**
   * Vertical multiplier, which must be used for defining an offset for fillText canvas method.
   * Each text must be shifted by this constant in top direction (Y axis).
   */
  public static readonly textVerticalOffsetMultiplier: number = 0.17;

  private location: NumericPoint;
  private range: Range;
  private size: Size | null;
  private orientation: AxisOrientation;
  private options: AxisOptions;

  private border: Konva.Shape;

  protected majorTicksScreenCoords: Array<number>;

  protected constructor(location: NumericPoint,
                        range: Range,
                        size: Size,
                        orientation: AxisOrientation,
                        options?: AxisOptions) {
    super();

    this.location = location;
    this.range = range;
    this.size = size;

    this.markDirty();
    this.orientation = orientation;

    this.options = options ?? AxisOptionsDefaults.Instance;

    let axis = this;

    this.majorTicksScreenCoords = [];

    this.border = new Konva.Shape({
      fill: this.options.backgroundColor,
      stroke: this.options.foregroundColor,
      strokeWidth: 1,
      sceneFunc: function (context, shape) {
        let location = axis.location;
        let size = axis.size;

        let roundedX = MathHelper.optimizeValue(location.x);
        let roundedY = MathHelper.optimizeValue(location.y);

        let roundedWidth = MathHelper.optimizeValue(size!.width);
        let roundedHeight = MathHelper.optimizeValue(size!.height);
        if (axis.options.drawBorder) {
          context.strokeRect(roundedX, roundedY, roundedWidth, roundedHeight);
        }
        context.fillRect(roundedX, roundedY, roundedWidth, roundedHeight);
      }
    });
  }

  protected abstract get axisShape(): Konva.Shape;

  /**
   * Returns axis dependant layers.
   * @returns {Array<string>} Axis dependant layers.
   */
  override getDependantLayers(): Array<string> {
    return ["visibleObjects"];
  }

  override placeOnChart(chart?: Chart) {
    super.placeOnChart(chart);

    if (chart) {
      let visibleObjectsLayer = chart!.getLayer('visibleObjects');
      visibleObjectsLayer.add(this.border);
      visibleObjectsLayer.add(this.axisShape);
      this.updateAxisSize();
    }
  }

  protected updateAxisSize() {
  }

  /**
   * Returns axis size
   * @returns {Size} axis size.
   */
  getSize() {
    /// <summary>Returns axis actual width.</summary>
    /// <returns type="Number" />
    return this.size;
  }

  /**
   * Returns axis orientation
   * @returns {AxisOrientation} axis orientation.
   */
  getOrientation() {
    return this.orientation;
  }


  /**
   * Removes axis from chart.
   */
  override removeFromChart() {
    super.removeFromChart();
    this.axisShape.remove();
    this.border.remove();
  }

  /**
   * Returns tick's screen coordinate
   * @returns {number} Tick's screen coordinate.
   */
  protected getTickScreenCoordinate(tick: number, screenWidth: number, screenHeight: number, range: Range) {
    if (this.orientation == AxisOrientation.Horizontal)
      return CoordinateTransform.dataToScreenX(tick, range, screenWidth);
    else
      return CoordinateTransform.dataToScreenY(tick, range, screenHeight);
  }

  /**
   * Generates label's size for specified label.
   * @param {string} label - Label to measure.
   * @returns {Size} Label's size.
   */
  protected generateLabelSize(label: string) {
    let width = TextMeasureUtils.measureTextWidth(FontHelper.fontToString(this.options.font), label);
    let height = this.options.font.size;
    return new Size(width, height);
  }
}
