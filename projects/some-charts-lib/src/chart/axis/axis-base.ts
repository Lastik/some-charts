import {AxisOptions, AxisOptionsDefaults} from "../../options";
import Konva from "konva";
import {FontHelper, MathHelper, TextMeasureUtils} from "../../services";
import {ChartRenderableItem} from "../chart-renderable-item";
import {Chart} from "../chart";
import {MajorTicksGenerator, MinorTicksGenerator, Tick} from "./ticks";
import {DataTransformation, NumericPoint, NumericRange, Range, Size} from '../../geometry';
import zipWith from 'lodash-es/zipWith';
import extend from "lodash-es/extend";
import {AxisOrientation} from "./axis-orientation";
import {TicksCountChange} from "./ticks-count-change";
import {LayerId} from "../../layer-id";
import {flow, partialRight} from "lodash-es";
import sortBy from "lodash-es/sortBy";
import map from "lodash-es/map";

export abstract class AxisBase<TickType extends Object, AxisOptionsType extends AxisOptions> extends ChartRenderableItem {
  /**
   * Vertical multiplier, which must be used for defining an offset for fillText canvas method.
   * Each text must be shifted by this constant in top direction (Y axis).
   */
  public static readonly textVerticalOffsetMultiplier: number = 0.17;

  protected location: NumericPoint;
  protected range: Range<TickType>;
  protected initialWidth: number | undefined;
  protected initialHeight: number | undefined;
  protected orientation: AxisOrientation;
  protected options: AxisOptionsType;

  private dataTransformation: DataTransformation;

  protected _size: Size;

  public get size(): Size{
    return this._size;
  }

  private borderShape: Konva.Shape;
  private ticksShape: Konva.Shape;

  protected majorTicks: Tick<TickType>[];
  protected minorTicks?: Tick<TickType>[];

  protected majorTicksLabelsSizes?: Size[];
  protected majorTicksScreenCoords: number[];
  protected minorTicksScreenCoords: number[];

  protected readonly majorTicksGenerator: MajorTicksGenerator<TickType>;
  protected readonly minorTicksGenerator?: MinorTicksGenerator<TickType>;

  static readonly increaseTicksCountCoeff = 2;
  static readonly decreaseTicksCountCoeff = 1.5;
  static readonly generateMajorTicksMaxAttempts = 12;

  protected constructor(location: NumericPoint,
                        orientation: AxisOrientation,
                        range: Range<TickType>,
                        dataTransformation: DataTransformation,
                        options: AxisOptionsType,
                        width?: number,
                        height?: number,
                        private textMeasureUtils: TextMeasureUtils = TextMeasureUtils.Instance) {
    super();

    this.location = location;
    this.range = range;

    this.dataTransformation = dataTransformation;

    this.initialWidth = width;
    this.initialHeight = height;

    this.orientation = orientation;

    this.validateAxisInitialWidth();
    this.validateAxisInitialHeight();

    this._size = new Size(width ?? 0, height ?? 0);

    this.markDirty();

    this.majorTicks = [];
    this.minorTicks = [];

    this.majorTicksScreenCoords = [];
    this.minorTicksScreenCoords = [];

    this.options = extend(AxisOptionsDefaults.Instance, options);

    this.majorTicksGenerator = this.createMajorTicksGenerator();
    this.minorTicksGenerator = this.createMinorTicksGenerator();

    let self = this;

    this.borderShape = new Konva.Shape({
      fill: this.options.backgroundColor,
      stroke: this.options.foregroundColor,
      strokeWidth: 1,
      sceneFunc: function (context, shape) {
        let location = self.location;
        let size = self._size;

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

        let majorTicksCount = self.majorTicks.length;
        let minorTicksCount = self.minorTicks?.length ?? 0;

        let majorTicksScreenXCoords = self.majorTicksScreenCoords;
        let minorTicksScreenXCoords = self.minorTicksScreenCoords;

        let axisRenderOriginX = MathHelper.optimizeValue(self.location.x);
        let axisRenderOriginY = MathHelper.optimizeValue(self.location.y);

        let axisRenderWidth = MathHelper.optimizeValue(self._size.width);
        let axisRenderHeight = MathHelper.optimizeValue(self._size.height);

        context.save();
        context.beginPath();
        context.rect(axisRenderOriginX, axisRenderOriginY, axisRenderWidth, axisRenderHeight);
        context.clip();

        context.setAttr('font', FontHelper.fontToString(self.options?.font!));
        context.setAttr('textBaseline', 'top');

        context.beginPath();

        if (self.orientation == AxisOrientation.Horizontal) {

          for (let i = 0; i < majorTicksCount; i++) {
            let tick = majorTicks[i];

            let tickScreenXCoord = majorTicksScreenXCoords[i];
            let labelSize = self.measureLabelSizeForMajorTick(tick);

            context.fillText(tick.toString(),
              self.location.x + tickScreenXCoord - labelSize.width / 2,
              self.location.y + tick.length - labelSize.height * AxisBase.textVerticalOffsetMultiplier);

            let xVal = MathHelper.optimizeValue(self.location.x + tickScreenXCoord);
            let yVal = MathHelper.optimizeValue(self.location.y);
            context.moveTo(xVal, yVal);
            yVal = MathHelper.optimizeValue(self.location.y + tick.length);
            context.lineTo(xVal, yVal);
          }

          if(self.minorTicks !== undefined) {
            let minorTicks = self.minorTicks!;
            for (let i = 0; i < minorTicksCount; i++) {
              let tick = minorTicks[i];
              let ticksScreenXCoord = minorTicksScreenXCoords[i]

              let xVal = MathHelper.optimizeValue(self.location.x + ticksScreenXCoord);
              let yVal = MathHelper.optimizeValue(self.location.y);
              context.moveTo(xVal, yVal);
              yVal = MathHelper.optimizeValue(self.location.y + tick.length);
              context.lineTo(xVal, yVal);
            }
          }
        } else {

          let labelVerticalDelimiter = 2 - 2 * AxisBase.textVerticalOffsetMultiplier;

          for (let i = 0; i < majorTicksCount; i++) {
            let tick = majorTicks[i];

            let tickScreenXCoord = majorTicksScreenXCoords[i];
            let labelSize = self.measureLabelSizeForMajorTick(tick);

            context.fillText(tick.toString(),
              self.location.x + self._size.width - labelSize.width - (tick.length + 2),
              self.location.y + tickScreenXCoord - labelSize.height / labelVerticalDelimiter);

            let xVal = MathHelper.optimizeValue(self.location.x + self._size.width - tick.length);
            let yVal = MathHelper.optimizeValue(self.location.y + tickScreenXCoord);
            context.moveTo(xVal, yVal);
            xVal = MathHelper.optimizeValue(self.location.x + self._size.width);
            context.lineTo(xVal, yVal);
          }

          if(self.minorTicks !== undefined) {
            let minorTicks = self.minorTicks!;
            for (let i = 0; i < minorTicksCount; i++) {
              let tick = minorTicks[i];
              let tickSceenXCoord = minorTicksScreenXCoords[i];

              let xVal = MathHelper.optimizeValue(self.location.x + self._size.width - tick.length);
              let yVal = MathHelper.optimizeValue(self.location.y + tickSceenXCoord);
              context.moveTo(xVal, yVal);
              xVal = MathHelper.optimizeValue(self.location.x + self._size.width);
              context.lineTo(xVal, yVal);
            }
          }
        }
        context.stroke();
        context.restore();
      }
    })
  }

  protected validateAxisInitialWidth(){
    if(this.initialWidth === undefined && this.orientation != AxisOrientation.Vertical){
      throw new Error("Undefined width is supported for vertical axis only");
    }
  }

  protected validateAxisInitialHeight(){
    if(this.initialHeight === undefined && this.orientation != AxisOrientation.Horizontal){
      throw new Error("Undefined height is supported for horizontal axis only");
    }
  }

  protected abstract createMajorTicksGenerator(): MajorTicksGenerator<TickType>;
  protected abstract createMinorTicksGenerator(): MinorTicksGenerator<TickType> | undefined;

  /**
   * Returns axis dependant layers.
   * @returns {Array<string>} Axis dependant layers.
   */
  override getDependantLayers(): Array<string> {
    return [LayerId.Chart];
  }

  override placeOnChart(chart?: Chart) {
    super.placeOnChart(chart);

    if (chart) {
      let chartLayer = chart!.getLayer(LayerId.Chart);
      if(chartLayer) {
        chartLayer.add(this.borderShape);
        chartLayer.add(this.ticksShape);
        this.update(this.location, this.range, this.initialWidth, this.initialHeight);
      }
    }
  }

  /**
   * Returns axis size
   * @returns {Size} axis size.
   */
  getSize() {
    return this._size;
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
  protected getTickScreenCoordinate(tick: Tick<TickType>, screenWidth: number, screenHeight: number, range: Range<TickType>): number {

    let numericRange = new NumericRange(this.axisValueToNumber(range.min), this.axisValueToNumber(range.max));

    if (this.orientation == AxisOrientation.Horizontal)
      return this.dataTransformation.dataToScreenX(this.axisValueToNumber(tick.value), numericRange, screenWidth);
    else
      return this.dataTransformation.dataToScreenY(this.axisValueToNumber(tick.value), numericRange, screenHeight);
  }

  /**
   * Converts value from axis inits to number.
   * */
  abstract axisValueToNumber(tickValue: TickType): number;

  /**
   * Measures labels sizes for an array of major ticks
   * @param { Array<Tick>} ticks - Array of ticks
   * @returns {Array<Size>}
   * */
  protected measureLabelsSizesForMajorTicks(ticks: Array<Tick<TickType>>): Array<Size> {

    let labelsSizes = [];

    for (let tick of ticks) {
      labelsSizes.push(this.measureLabelSizeForMajorTick(tick));
    }

    return labelsSizes;
  }

  /**
   * Measures label's size for specified major tick.
   * @param {string} tick - Tick for which to generate label size.
   * @returns {Size} Label's size.
   */
  protected measureLabelSizeForMajorTick(tick: Tick<TickType>): Size{
    if (this.majorTicks != null) {
      let tickFromArr = this.majorTicks[tick.index];
      if (tickFromArr != null && tickFromArr.index === tick.index && this.majorTicksLabelsSizes) {
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
    let width = this.textMeasureUtils!.measureTextWidth(FontHelper.fontToString(this.options?.font!), label);
    let height = this.options?.font?.size!;
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
                range: Range<TickType>,
                width?: number,
                height?: number){

    this.location = location;
    this.range = range;

    this.initialWidth = width;
    this.initialHeight = height;

    this.validateAxisInitialWidth();
    this.validateAxisInitialHeight();

    this.updateTicksData(this.location, this.range, this._size);
    this.updateAxisSize();
    this.markDirty();
  }

  protected updateTicksData(location: NumericPoint,
                            range: Range<TickType>,
                            size: Size){

    this.majorTicks = this.generateMajorTicks(range, size);
    this.majorTicksLabelsSizes = this.measureLabelsSizesForMajorTicks(this.majorTicks);
    this.minorTicks = this.minorTicksGenerator?.generateMinorTicks(range, this.majorTicks);

    let majorTicksScreenCoords = [];
    let minorTicksScreenCoords = [];

    for (let tick of this.majorTicks) {
      majorTicksScreenCoords.push(this.getTickScreenCoordinate(tick, size.width, size.height, range));
    }

    this.majorTicksScreenCoords = majorTicksScreenCoords;

    if(this.minorTicks) {
      for (let tick of this.minorTicks) {
        minorTicksScreenCoords.push(this.getTickScreenCoordinate(tick, size.width, size.height, range));
      }
    }

    this.minorTicksScreenCoords = minorTicksScreenCoords;
  }

  protected updateAxisSize() {

    let renderWidth = this.initialWidth;
    let renderHeight = this.initialHeight;

    if (this.initialWidth === undefined && this.orientation == AxisOrientation.Vertical) {
      renderWidth = 0;

      for (let tick of this.majorTicks) {
        let labelSize = this.measureLabelSizeForMajorTick(tick);
        renderWidth = Math.max(labelSize.width, renderWidth);
      }

      renderWidth += this.options?.majorTickHeight! + 4;
    }

    if (this.initialHeight === undefined && this.orientation == AxisOrientation.Horizontal) {
      renderHeight = this.textMeasureUtils!.measureFontHeight(this.options?.font!) + this.options?.majorTickHeight! + 2;
    }

    this._size = new Size(renderWidth!, renderHeight!);
  }

  /**
   * Generates ticks for specified axis.
   * @param {Range} range - axis range.
   * @param {Size} size - axis size;
   * @returns {Array<Tick>}
   * */
  protected generateMajorTicks(range: Range<TickType>, size: Size): Array<Tick<TickType>> {
    let state: TicksCountChange | undefined = undefined;
    let prevState;
    let prevTicksArrLength = -1;
    let ticksCount = this.majorTicksGenerator.defaultTicksCount;
    let attempt = 1;
    let ticks: Array<Tick<TickType>> = [];

    while(state != TicksCountChange.OK) {
      if (attempt++ >= AxisBase.generateMajorTicksMaxAttempts){
        console.log('Axis major ticks generation failed');
        ticks = [];
        break;
      }
      else {

        if (range.isPoint())
          ticksCount = 1;

        ticks = this.majorTicksGenerator.generateTicks(this.range, ticksCount);

        if (ticks.length == prevTicksArrLength) {
          state = TicksCountChange.OK;
        }
        else {
          prevTicksArrLength = ticks.length;

          let labelsSizes = this.measureLabelsSizesForMajorTicks(ticks);

          prevState = state;

          state = this.checkLabelsArrangement(this._size, labelsSizes, ticks, range);

          if (prevState == TicksCountChange.Decrease && state == TicksCountChange.Increase) {
            state = TicksCountChange.OK;
          }
          if (state != TicksCountChange.OK) {

            let prevTicksCount = ticksCount;

            if (state == TicksCountChange.Decrease) {
              ticksCount = this.majorTicksGenerator.suggestIncreasedTicksCount(ticksCount);
            } else {
              ticksCount = this.majorTicksGenerator.suggestDecreasedTickCount(ticksCount);
            }
            if (ticksCount == 0 || prevTicksCount == ticksCount) {
              ticksCount = prevTicksCount;
              state = TicksCountChange.OK;
            }
          }
        }
      }
    }

    return ticks;
  }

  /**
  * Checks labels arrangement on axis (whether they overlap with each other or not).
  * Returns if the amount of ticks on axis must be changed or preserved.
  * @param {Size} axisSize - axis size;
  * @param {Array<Size>} ticksLabelsSizes - sizes of ticks labels;
  * @param {Array<Tick>} ticks - ticks.
  * @param {Range} range - axis range.
  * @returns {TicksCountChange}
  * */
  protected checkLabelsArrangement(axisSize: Size, ticksLabelsSizes: Array<Size>, ticks: Array<Tick<TickType>>, range: Range<TickType>): TicksCountChange {
    let isAxisHorizontal = this.orientation == AxisOrientation.Horizontal;

    let ticksRenderInfo = flow(
      partialRight(map, ((sizeTickTuple : {tick: Tick<TickType>, labelSize: Size})=>{
        return {
          coord: this.getTickScreenCoordinate(sizeTickTuple.tick, axisSize.width, axisSize.height, range),
          length: isAxisHorizontal ? sizeTickTuple.labelSize.width : sizeTickTuple.labelSize.height
        }
      })),
      sortBy((i: {coord: number, length: number}) => i.coord))(zipWith(ticksLabelsSizes, ticks, (size, tick) => { return {tick: tick, labelSize: size };}));

    let res: TicksCountChange = TicksCountChange.OK;

    for (let i = 0; i < ticksRenderInfo.length - 1; i++) {
      let leftTickRenderInfo = ticksRenderInfo[i];
      let rightTickRenderInfo = ticksRenderInfo[i + 1];

      if ((leftTickRenderInfo.coord + leftTickRenderInfo.length * AxisBase.decreaseTicksCountCoeff) > rightTickRenderInfo.coord) {
        res = TicksCountChange.Decrease;
        break;
      }
      if ((leftTickRenderInfo.coord + leftTickRenderInfo.length * AxisBase.increaseTicksCountCoeff) < rightTickRenderInfo.coord) {
        res = TicksCountChange.Increase;
      }
    }
    return res;
  }

  /**
   * Returns major ticks screen coordinates
   * @returns {number} Major ticks screen coordinates
   * */
  public getMajorTicksScreenCoords(){
    return this.majorTicksScreenCoords;
  }
}
