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
import {MajorTicksGenerator} from "./ticks/major-ticks-generator";
import {MinorTicksGenerator} from "./ticks/minor-ticks-generator";
import {Range} from '../../model/range';

export abstract class AxisBase<T extends Object> extends ChartRenderableItem {
  /**
   * Vertical multiplier, which must be used for defining an offset for fillText canvas method.
   * Each text must be shifted by this constant in top direction (Y axis).
   */
  public static readonly textVerticalOffsetMultiplier: number = 0.17;

  protected location: NumericPoint;
  protected range: Range<T>;
  protected size: Size;
  protected orientation: AxisOrientation;
  protected options: AxisOptions;

  private borderShape: Konva.Shape;
  private ticksShape: Konva.Shape;

  protected majorTicks: Tick<T>[];
  protected minorTicks: Tick<T>[];

  protected majorTicksLabelsSizes: Size[];
  protected majorTicksScreenCoords: number[];
  protected minorTicksScreenCoords: number[];

  protected readonly majorTicksGenerator: MajorTicksGenerator<T>;
  protected readonly minorTicksGenerator: MinorTicksGenerator<T>;

  static readonly increaseTicksCountCoeff = 2;
  static readonly decreaseTicksCountCoeff = 1.5;
  static readonly generateMajorTicksMaxAttempts = 12;

  protected constructor(location: NumericPoint,
                        range: Range<T>,
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

    this.majorTicksGenerator = this.createMajorTicksGenerator();
    this.minorTicksGenerator = this.createMinorTicksGenerator();

    let self = this;

    this.borderShape = new Konva.Shape({
      fill: this.options.backgroundColor,
      stroke: this.options.foregroundColor,
      strokeWidth: 1,
      sceneFunc: function (context, shape) {
        let location = self.location;
        let size = self.size;

        let roundedX = MathHelper.optimizeValue(location.x);
        let roundedY = MathHelper.optimizeValue(location.y);

        let roundedWidth = MathHelper.optimizeValue(size!.width);
        let roundedHeight = MathHelper.optimizeValue(size!.height);
        if (self.options.drawBorder) {
          context.strokeRect(roundedX, roundedY, roundedWidth, roundedHeight);
        }
        context.fillRect(roundedX, roundedY, roundedWidth, roundedHeight);
      }
    });

    this.ticksShape = new Konva.Shape({
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

            context.fillText(tick.toString(),
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

  protected abstract createMajorTicksGenerator(): MajorTicksGenerator<T>;
  protected abstract createMinorTicksGenerator(): MinorTicksGenerator<T>;

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
      visibleObjectsLayer.add(this.borderShape);
      visibleObjectsLayer.add(this.ticksShape);
      this.update(this.location, this.range, this.size);
    }
  }

  protected coerceAxisSizeToFitTicks() {
  }

  protected updateTicksData(location: NumericPoint,
                            range: Range<T>,
                            size: Size){

    this.majorTicks = this.generateMajorTicks(range, size);
    this.minorTicks = this.minorTicksGenerator.generateMinorTicks(range, this.majorTicks);

    let majorTicksScreenCoords = [];
    let minorTicksScreenCoords = [];

    for (let tick of this.majorTicks) {
      majorTicksScreenCoords.push(this.getTickScreenCoordinate(tick, size.width, size.height, range));
    }

    this.majorTicksScreenCoords = majorTicksScreenCoords;

    for (let tick of this.minorTicks) {
      minorTicksScreenCoords.push(this.getTickScreenCoordinate(tick, size.width, size.height, range));
    }

    this.minorTicksScreenCoords = minorTicksScreenCoords;
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
    this.ticksShape.remove();
    this.borderShape.remove();
  }

  /**
   * Returns tick's screen coordinate
   * @returns {number} Tick's screen coordinate.
   */
  protected abstract getTickScreenCoordinate(tick: Tick<T>, screenWidth: number, screenHeight: number, range: Range<T>): number;

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

  public update(location: NumericPoint,
                range: Range<T>,
                size: Size){
    /// <summary>Updates axis state.</summary>
    /// <param name="location" type="Point">NumericAxis location.</param>
    /// <param name="range" type="Range">NumericAxis range.</param>
    /// <param name="size" type="Size">NumericAxis size.</param>

    this.location = location;
    this.range = range;
    this.size = size;

    this.updateTicksData(this.location, this.range, this.size);
    this.coerceAxisSizeToFitTicks();
  }

  NumericAxis._updateInternal = function (axis, location, range, size) {
    axis._ticksArr = null;
    axis._labelsSizesArr = null;

    var ticks = NumericAxis._generateTicks(axis, range, size);
    var minorTicks = axis.ticksGenerator.generateMinorTicks(range, ticks);

    axis._ticksOnScreen = [];
    axis._minorTicksOnScreen = [];

    for (var i = 0; i < ticks.length; i++) {
      var tick = ticks[i];
      axis._ticksOnScreen.push(axis.getCoordinateFromTick(tick, size.width, size.height, range));
    }

    for (var i = 0; i < minorTicks.length; i++) {
      var tick = minorTicks[i];
      axis._minorTicksOnScreen.push(axis.getCoordinateFromTick(tick, size.width, size.height, range));
    }

    axis.compositeShape.ticks = ticks;
    axis.compositeShape.minorTicks = minorTicks;
    axis.compositeShape.location = location;

    if (axis.size.width == null && axis._orientation == Orientation.Vertical) {
      var maxSize = 0;

      for (var i = 0; i < ticks.length; i++) {
        var tick = ticks[i];
        var labelSize = axis._generateLabelSize(tick);
        maxSize = Math.max(labelSize.width, maxSize);
      }

      maxSize += axis.majorTickHeight + 4;

      axis._actualSize.width = maxSize;
    }

    if (axis.size.height == null && axis._orientation == Orientation.Horizontal) {
      axis._actualSize.height = axis.fontHeight + axis.majorTickHeight + 2;
    }

    var actualSize = axis._actualSize;

    axis.border.width = actualSize.width;
    axis.border.height = actualSize.height;
    axis.border.location = location;

    axis._isDirty = true;
  }

  protected generateMajorTicks(range: Range, size: Size) {
    /// <summary>Generates ticks for specified axis.</summary>
    /// <param name="range" type="Range">Axis range.</param>
    /// <param name="size" type="Size">Axis size.</param>
    var result = TickCountChange.OK;
    var prevResult;
    var prevActualTickCount = -1;
    var ticksCount = TicksGenerator.defaultTicksCount;
    var iteration = 0;
    var ticks = null;
    var labelsLengths = null;

    range = range || new Range(0, 0, false);
    axis = axis || new NumericAxis(0, 0, 0, 0);

    var axisSize = axis.size;

    var ticksGenerator = axis.ticksGenerator;

    do {
      if (++iteration >= NumericAxis.maxTickArrangeIterations)
        throw "NumericAxis assertion failed.";

      if (range.isPoint())
        ticksCount = 1;

      var r = new Range(
        isFinite(range.min) ? range.min : 0,
        isFinite(range.max) ? range.max : 1);

      ticks = ticksGenerator.generateTicks(r, ticksCount);

      if (ticks.length == prevActualTickCount) {
        result = TickCountChange.OK;
        break;
      }

      prevActualTickCount = ticks.length;

      labelsSizes = axis._generateLabelsSizes(ticks);

      prevResult = result;

      result = axis._checkLabelsArrangement(axisSize, labelsSizes, ticks, range);

      if (prevResult == TickCountChange.Decrease && result == TickCountChange.Increase) {
        result = TickCountChange.OK;
      }
      if (result != TickCountChange.OK) {

        var prevTickCount = ticksCount;

        if (result == TickCountChange.Decrease)
          ticksCount = ticksGenerator.decreaseTickCount(ticksCount);

        else {
          ticksCount = ticksGenerator.increaseTicksCount(ticksCount);

        }
        if (ticksCount == 0 || prevTickCount == ticksCount) {
          ticksCount = prevTickCount;
          result = TickCountChange.OK;
        }
      }
    }

    while (result != TickCountChange.OK);

    return ticks;
  }

  p._checkLabelsArrangement = function (axisSize, labelsSizes, ticks, range) {
    /// <summary>Checks labels arrangement on axis.</summary>
    var isHorizontal = this._orientation == Orientation.Horizontal;

    var actualLabels = [];

    for (var i = 0; i < labelsSizes.length; i++) {
      if (labelsSizes[i] != null) {
        var actualLabel = {
          label: labelsSizes[i],
          tick: ticks[i]
        }
        actualLabels.push(actualLabel);
      }
    }

    var sizeInfos = [];

    for (var i = 0; i < actualLabels.length; i++) {
      var item = actualLabels[i];
      var x = this.getTickScreenCoordinate(item.tick, axisSize.width, axisSize.height, range);

      var size = isHorizontal ? item.label.width : item.label.height;

      var sizeInfo = {
        x: x,
        size: size
      };

      sizeInfos.push(sizeInfo);
    }

    sizeInfos.sort(function (obj1, obj2) {
      if (obj1.x < obj2.x)
        return -1;
      else if (obj1.x > obj2.x)
        return 1;
      return 0;
    });

    var res = TickCountChange.OK;

    for (var i = 0; i < sizeInfos.length - 1; i++) {
      if ((sizeInfos[i].x + sizeInfos[i].size * NumericAxis.decreaseRatio) > sizeInfos[i + 1].x) {
        res = TickCountChange.Decrease;
        return res;
      }
      if ((sizeInfos[i].x + sizeInfos[i].size * NumericAxis.increaseRatio) < sizeInfos[i + 1].x) {
        if (res != TickCountChange.Decrease)
          res = TickCountChange.Increase;
      }
    }
    return res;
  }
}
