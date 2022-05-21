import {NumericPoint} from "../../model/point/numeric-point";
import {Size} from "../../model/size";
import {AxisOptions, AxisOptionsDefaults} from "../../options/axis-options";
import Konva from "konva";
import {MathHelper} from "../../services/math-helper";
import {ChartRenderableItem} from "../../core/chart-renderable-item";
import {Chart} from "../chart";
import {CoordinateTransform} from "../../services/coordinate-transform";
import {TextMeasureUtils} from "../../services/text-measure-utils";
import {FontHelper} from "../../services/font-helper";
import {NumericRange} from "../../model/numeric-range";
import {Tick} from "./ticks/tick";
import {tick} from "@angular/core/testing";

export abstract class AxisBase<T> extends ChartRenderableItem {
  /**
   * Vertical multiplier, which must be used for defining an offset for fillText canvas method.
   * Each text must be shifted by this constant in top direction (Y axis).
   */
  public static readonly textVerticalOffsetMultiplier: number = 0.17;

  protected location: NumericPoint;
  protected range: Range;
  protected size: Size;
  protected orientation: AxisOrientation;
  protected options: AxisOptions;

  private border: Konva.Shape;
  private axisShape: Konva.Shape;

  protected majorTicks: Tick<T>[];
  protected minorTicks: Tick<T>[];

  protected majorTicksLabelsSizes: Size[];
  protected majorTicksScreenCoords: number[];
  protected minorTicksScreenCoords: number[];

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

    this.majorTicks = [];
    this.minorTicks = [];

    this.majorTicksLabelsSizes = [];

    this.majorTicksScreenCoords = [];
    this.minorTicksScreenCoords = [];

    this.options = options ?? AxisOptionsDefaults.Instance;

    let axis = this;

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

    let self = this;

    this.axisShape = new Konva.Shape({
      fill: this.options.backgroundColor,
      stroke: this.options.foregroundColor,
      strokeWidth: 1,
      sceneFunc: function(context: Konva.Context, shape: Konva.Shape) {
        let majorTicks = self.majorTicks;
        let minorTicks = self.minorTicks;

        let majorTicksCount = self.majorTicks.length;
        let minorTicksCount = self.minorTicks.length;

        let majorTicksScreenXCoords = self.majorTicksScreenCoords;
        let minorTicksScreenXCoords = self.minorTicksScreenCoords;

        let axisRenderOriginX = MathHelper.optimizeValue(self.location.x);
        let axisRenderOriginY = MathHelper.optimizeValue(self.location.y);

        let axisRenderWidth = MathHelper.optimizeValue(self.size.width);
        let axisRenderHeight = MathHelper.optimizeValue(self.size.height);

        context.save();
        context.beginPath();
        context.rect(axisRenderOriginX, axisRenderOriginY, axisRenderWidth, axisRenderHeight);
        context.clip();

        context.setAttr('font', FontHelper.fontToString(self.options.font));
        context.setAttr('textBaseline', 'top');

        context.beginPath();

        if (self.orientation == AxisOrientation.Horizontal) {

          for (let i = 0; i < majorTicksCount; i++) {
            let tick = majorTicks[i];

            let tickScreenXCoord = majorTicksScreenXCoords[i];
            let labelSize = self.generateMajorTickLabelSize(tick);

            context.fillText(tick.value.toString(),
              self.location.x + tickScreenXCoord - labelSize.width / 2,
              self.location.y + tick.length - labelSize.height * AxisBase.textVerticalOffsetMultiplier);

            let xVal = MathHelper.optimizeValue(self.location.x + tickScreenXCoord);
            let yVal = MathHelper.optimizeValue(self.location.y);
            context.moveTo(xVal, yVal);
            yVal = MathHelper.optimizeValue(self.location.y + tick.length);
            context.lineTo(xVal, yVal);
          }

          for (let i = 0; i < minorTicksCount; i++) {
            let tick = minorTicks[i];
            let ticksScreenXCoord = minorTicksScreenXCoords[i]

            let xVal = MathHelper.optimizeValue(self.location.x + ticksScreenXCoord);
            let yVal = MathHelper.optimizeValue(self.location.y);
            context.moveTo(xVal, yVal);
            yVal = MathHelper.optimizeValue(self.location.y + tick.length);
            context.lineTo(xVal, yVal);
          }
        } else {

          let labelVerticalDelimiter = 2 - 2 * AxisBase.textVerticalOffsetMultiplier;

          for (let i = 0; i < majorTicksCount; i++) {
            let tick = majorTicks[i];

            let tickScreenXCoord = majorTicksScreenXCoords[i];
            let labelSize = self.generateMajorTickLabelSize(tick);

            context.fillText(tick.toString(),
              self.location.x + self.size.width - labelSize.width - (tick.length + 2),
              self.location.y + tickScreenXCoord - labelSize.height / labelVerticalDelimiter);

            let xVal = MathHelper.optimizeValue(self.location.x + self.size.width - tick.length);
            let yVal = MathHelper.optimizeValue(self.location.y + tickScreenXCoord);
            context.moveTo(xVal, yVal);
            xVal = MathHelper.optimizeValue(self.location.x + self.size.width);
            context.lineTo(xVal, yVal);
          }

          //Place minor ticks

          for (let i = 0; i < minorTicksCount; i++) {
            let tickSceenXCoord = minorTicksScreenXCoords[i];

            let xVal = MathHelper.optimizeValue(self.location.x + self.size.width - tick.length);
            let yVal = MathHelper.optimizeValue(self.location.y + tickSceenXCoord);
            context.moveTo(xVal, yVal);
            xVal = MathHelper.optimizeValue(self.location.x + self.size.width);
            context.lineTo(xVal, yVal);
          }
        }
        context.stroke();
        context.restore();
      }
    })
  }

  protected abstract drawAxis(context: Konva.Context, shape: Konva.Shape): void;

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
  protected getTickScreenCoordinate(tick: number, screenWidth: number, screenHeight: number, range: NumericRange) {
    if (this.orientation == AxisOrientation.Horizontal)
      return CoordinateTransform.dataToScreenX(tick, range, screenWidth);
    else
      return CoordinateTransform.dataToScreenY(tick, range, screenHeight);
  }

  /**
   * Generates label's size for specified major tick.
   * @param {string} tick - Tick for which to generate label size.
   * @returns {Size} Label's size.
   */
  protected generateMajorTickLabelSize(tick: Tick<T>): Size{
    if (this.majorTicks != null) {
      let tickFromArr = this.majorTicks[tick.index];
      if (tickFromArr != null && tickFromArr.index === tick.index) {
        return this.majorTicksLabelsSizes[tick.index];
      }
      else {
        return this.generateLabelSize(tick.toString());
      }
    }
    else {
      return this.generateLabelSize(tick.toString());
    }
  }

  /**
   * Generates label's size for specified label.
   * @param {string} label - Label to measure.
   * @returns {Size} Label's size.
   */
  protected generateLabelSize(label: string): Size {
    let width = TextMeasureUtils.measureTextWidth(FontHelper.fontToString(this.options.font), label);
    let height = this.options.font.size;
    return new Size(width, height);
  }
}
