﻿import {NumericPoint} from "../../model/point/numeric-point";
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
  protected initialWidth: number | undefined;
  protected initialHeight: number | undefined;
  protected orientation: AxisOrientation;
  protected options: AxisOptions;

  protected size: Size;

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
                        width?: number,
                        height?: number,
                        orientation: AxisOrientation,
                        options?: AxisOptions) {
    super();

    this.location = location;
    this.range = range;

    this.initialWidth = width;
    this.initialHeight = height;

    this.validateAxisInitialWidth();
    this.validateAxisInitialHeight();

    this.size = new Size(width ?? 0, height ?? 0);

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
            let labelSize = self.measureMajorTickLabelSize(tick);

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
            let labelSize = self.measureMajorTickLabelSize(tick);

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

  protected validateAxisInitialWidth(){
    if(this.initialWidth === undefined && this.orientation != AxisOrientation.Vertical){
      throw "Undefined width is supported for vertical axis only";
    }
  }

  protected validateAxisInitialHeight(){
    if(this.initialHeight === undefined && this.orientation != AxisOrientation.Horizontal){
      throw "Undefined width is supported for horizontal axis only";
    }
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
      this.update(this.location, this.range, this.initialWidth, this.initialHeight);
    }
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
  protected measureMajorTickLabelSize(tick: Tick<T>): Size{
    if (this.majorTicks != null) {
      let tickFromArr = this.majorTicks[tick.index];
      if (tickFromArr != null && tickFromArr.index === tick.index) {
        return this.majorTicksLabelsSizes[tick.index];
      }
      else {
        return this.measureLabelSize(tick.toString());
      }
    }
    else {
      return this.measureLabelSize(tick.toString());
    }
  }

  /**
   * Generates label's size for specified label.
   * @param {string} label - Label to measure.
   * @returns {Size} Label's size.
   */
  protected measureLabelSize(label: string): Size {
    let width = TextMeasureUtils.measureTextWidth(FontHelper.fontToString(this.options.font), label);
    let height = this.options.font.size;
    return new Size(width, height);
  }

  /**
   * Updates axis state.
   * @param {Point} location - axis location on chart.
   * @param {Range} range - axis data range.
   * @param {number} width - axis width. May be undefined (for vertical axis only)
   * @param {number} height - axis height. May be undefined (for horizontal axis only)
   */
  public update(location: NumericPoint,
                range: Range<T>,
                width?: number,
                height?: number){

    this.location = location;
    this.range = range;

    this.initialWidth = width;
    this.initialHeight = height;

    this.validateAxisInitialWidth();
    this.validateAxisInitialHeight();

    this.updateTicksData(this.location, this.range, this.size);
    this.updateAxisSize();
    this.markDirty();
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

  protected updateAxisSize() {

    let renderWidth = this.initialWidth;
    let renderHeight = this.initialHeight;

    if (this.initialWidth === undefined && this.orientation == AxisOrientation.Vertical) {
      renderWidth = 0;

      for (let tick of this.majorTicks) {
        let labelSize = this.measureMajorTickLabelSize(tick);
        renderWidth = Math.max(labelSize.width, renderWidth);
      }

      renderWidth += this.options.majorTickHeight + 4;
    }

    if (this.initialHeight === undefined && this.orientation == AxisOrientation.Horizontal) {
      renderHeight = TextMeasureUtils.measureFontHeight(this.options.font) + this.options.majorTickHeight + 2;
    }

    this.size = new Size(renderWidth!, renderHeight!);
  }

  protected generateMajorTicks(range: Range<T>, size: Size) {
    /// <summary>Generates ticks for specified axis.</summary>
    /// <param name="range" type="Range">Axis range.</param>
    /// <param name="size" type="Size">Axis size.</param>
    let result = TickCountChange.OK;
    let prevResult;
    let prevActualTickCount = -1;
    let ticksCount = this.majorTicksGenerator.defaultTicksCount;
    let iteration = 0;
    let ticks = null;

    do {
      if (++iteration >= AxisBase.generateMajorTicksMaxAttempts)
        throw "NumericAxis assertion failed.";

      if (range.isPoint())
        ticksCount = 1;

      ticks = this.majorTicksGenerator.generateTicks(this.range, ticksCount);

      if (ticks.length == prevActualTickCount) {
        result = TickCountChange.OK;
        break;
      }

      prevActualTickCount = ticks.length;

      let labelsSizes = this.generateLabelsSizes(ticks);

      prevResult = result;

      result = this.checkLabelsArrangement(this.size, labelsSizes, ticks, range);

      if (prevResult == TickCountChange.Decrease && result == TickCountChange.Increase) {
        result = TickCountChange.OK;
      }
      if (result != TickCountChange.OK) {

        let prevTickCount = ticksCount;

        if (result == TickCountChange.Decrease)
          ticksCount = this.majorTicksGenerator.suggestIncreasedTicksCount(ticksCount);

        else {
          ticksCount = this.majorTicksGenerator.suggestDecreasedTickCount(ticksCount);
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
