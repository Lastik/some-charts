import {AxisOptions, AxisOptionsDefaults} from "../../options";
import Konva from "konva";
import {FontHelper, MathHelper, TextMeasureUtils} from "../../services";
import {ChartRenderableItem} from "../chart-renderable-item";
import {Chart} from "../chart";
import {MajorTicksGenerator, MinorTicksGenerator, Tick} from "./ticks";
import {DataTransformation, NumericPoint, NumericRange, Range, Size} from '../../geometry';
import zipWith from 'lodash-es/zipWith';
import merge from "lodash-es/merge";
import {AxisOrientation} from "./axis-orientation";
import {LabelsLayout} from "./labels-layout";
import {LayerId} from "../../layer-id";
import {cloneDeep, drop, flow, partialRight} from "lodash-es";
import sortBy from "lodash-es/sortBy";
import map from "lodash-es/map";

export abstract class AxisBase<DataType extends Object, AxisOptionsType extends AxisOptions> extends ChartRenderableItem<Konva.Shape> {
  /**
   * Vertical multiplier, which must be used for defining an offset for fillText canvas method.
   * Each text must be shifted by this constant in top direction (Y axis).
   */
  public static readonly textVerticalOffsetMultiplier: number = 0.17;

  protected location: NumericPoint;
  protected range: Range<DataType>;
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

  protected majorTicks: Tick<DataType>[];
  protected minorTicks?: Tick<DataType>[];

  protected majorTicksLabelsSizes?: Size[];
  protected majorTicksScreenCoords: number[];
  protected minorTicksScreenCoords: number[];

  protected readonly majorTicksGenerator: MajorTicksGenerator<DataType>;
  protected readonly minorTicksGenerator?: MinorTicksGenerator<DataType>;

  protected layerId: string;

  static readonly generateMajorTicksMaxAttempts = 12;

  protected constructor(location: NumericPoint,
                        orientation: AxisOrientation,
                        range: Range<DataType>,
                        dataTransformation: DataTransformation,
                        options: AxisOptionsType,
                        width?: number,
                        height?: number,
                        protected textMeasureUtils: TextMeasureUtils = TextMeasureUtils.Instance) {
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

    this.majorTicks = [];
    this.minorTicks = [];

    this.majorTicksScreenCoords = [];
    this.minorTicksScreenCoords = [];

    this.options = merge(cloneDeep(AxisOptionsDefaults.Instance), options);

    this.majorTicksGenerator = this.createMajorTicksGenerator();
    this.minorTicksGenerator = this.createMinorTicksGenerator();

    let self = this;


    this.borderShape = new Konva.Shape({
      location: this.location,
      size: this.size,
      sceneFunc: function (context, shape) {

        context.save();

        context.setAttr('fillStyle', self.options.backgroundColor);
        context.setAttr('strokeStyle', self.options.foregroundColor);
        context.setAttr('lineWidth', 1);

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

        context.restore();
      }
    });

    this.ticksShape = new Konva.Shape({
      location: this.location,
      size: this.size,
      orientation: this.orientation,
      majorTicks: this.majorTicks,
      minorTicks: this.minorTicks,
      majorTicksScreenCoords: this.majorTicksScreenCoords,
      minorTicksScreenCoords: this.minorTicksScreenCoords,
      sceneFunc: function(context: Konva.Context, shape: Konva.Shape) {
        let majorTicks = self.majorTicks;

        let majorTicksCount = self.majorTicks.length;

        let majorTicksScreenXCoords = self.majorTicksScreenCoords;
        let minorTicksScreenXCoords = self.minorTicksScreenCoords;

        let axisRenderOriginX = MathHelper.optimizeValue(self.location.x);
        let axisRenderOriginY = MathHelper.optimizeValue(self.location.y);

        let axisRenderWidth = MathHelper.optimizeValue(self._size.width);
        let axisRenderHeight = MathHelper.optimizeValue(self._size.height);

        context.save();

        context.setAttr('strokeStyle', self.options.foregroundColor);
        context.setAttr('lineWidth', 1);

        context.setAttr('fillStyle', self.options.backgroundColor);
        context.beginPath();
        context.rect(axisRenderOriginX, axisRenderOriginY, axisRenderWidth, axisRenderHeight);
        context.clip();

        context.setAttr('font', FontHelper.fontToString(self.options?.font!));
        context.setAttr('textBaseline', 'top');
        context.setAttr('fillStyle', self.options.foregroundColor);

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

          self.renderHorizontalMinorTicks(context);
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

          self.renderVerticalMinorTicks(context);
        }
        context.stroke();
        context.restore();
      }
    });

    this.layerId = LayerId.Chart;
    this.konvaDrawables = [this.borderShape, this.ticksShape];
  }

  protected renderHorizontalMinorTicks(context: Konva.Context) {
    if (this.minorTicks !== undefined) {
      let minorTicksCount = this.minorTicks?.length ?? 0;
      let minorTicksScreenXCoords = this.minorTicksScreenCoords;

      let minorTicks = this.minorTicks!;
      for (let i = 0; i < minorTicksCount; i++) {
        let tick = minorTicks[i];
        let ticksScreenXCoord = minorTicksScreenXCoords[i]

        let xVal = MathHelper.optimizeValue(this.location.x + ticksScreenXCoord);
        let yVal = MathHelper.optimizeValue(this.location.y);
        context.moveTo(xVal, yVal);
        yVal = MathHelper.optimizeValue(this.location.y + tick.length);
        context.lineTo(xVal, yVal);
      }
    }
  }

  protected renderVerticalMinorTicks(context: Konva.Context) {
    if (this.minorTicks !== undefined) {
      let minorTicksCount = this.minorTicks?.length ?? 0;
      let minorTicksScreenXCoords = this.minorTicksScreenCoords;

      let minorTicks = this.minorTicks!;
      for (let i = 0; i < minorTicksCount; i++) {
        let tick = minorTicks[i];
        let tickSceenXCoord = minorTicksScreenXCoords[i];

        let xVal = MathHelper.optimizeValue(this.location.x + this._size.width - tick.length);
        let yVal = MathHelper.optimizeValue(this.location.y + tickSceenXCoord);
        context.moveTo(xVal, yVal);
        xVal = MathHelper.optimizeValue(this.location.x + this._size.width);
        context.lineTo(xVal, yVal);
      }
    }
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

  protected abstract createMajorTicksGenerator(): MajorTicksGenerator<DataType>;
  protected abstract createMinorTicksGenerator(): MinorTicksGenerator<DataType> | undefined;

  override placeOnChart(chart?: Chart) {
    super.placeOnChart(chart);

    if(chart){
      this.update(this.location, this.range, this.initialWidth, this.initialHeight);
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
   * Returns tick's screen coordinate
   * @returns {number} Tick's screen coordinate.
   */
  protected getTickScreenCoordinate(tick: Tick<DataType>, screenWidth: number, screenHeight: number, range: Range<DataType>): number {

    let numericRange = new NumericRange(this.axisValueToNumber(range.min), this.axisValueToNumber(range.max));

    if (this.orientation == AxisOrientation.Horizontal)
      return this.dataTransformation.dataToScreenX(this.axisValueToNumber(tick.value), numericRange, screenWidth);
    else
      return this.dataTransformation.dataToScreenY(this.axisValueToNumber(tick.value), numericRange, screenHeight);
  }

  /**
   * Converts value from axis inits to number.
   * */
  abstract axisValueToNumber(tickValue: DataType): number;

  /**
   * Measures labels sizes for an array of major ticks
   * @param { Array<Tick>} ticks - Array of ticks
   * @returns {Array<Size>}
   * */
  protected measureLabelsSizesForMajorTicks(ticks: Array<Tick<DataType>>): Array<Size> {

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
  protected measureLabelSizeForMajorTick(tick: Tick<DataType>): Size{
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
                range: Range<DataType>,
                width?: number,
                height?: number){

    this.location = location;
    this.range = range;

    this.initialWidth = width;
    this.initialHeight = height;

    this.validateAxisInitialWidth();
    this.validateAxisInitialHeight();

    this.cleanMajorTicks();

    this.updateAxisSize();

    this.updateMajorTicks(this.range, this.size);
    this.updateMinorTicks(this.range);

    this.updateAxisSize();

    this.updateTicksScreenCoords(this.location, this.range, this._size);

    this.updateBorderShape();
    this.updateTicksShape();
  }

  protected cleanMajorTicks(){
    this.majorTicks = [];
    this.majorTicksLabelsSizes = undefined;
  }

  protected updateMajorTicks(range: Range<DataType>,
                             size: Size){
    this.majorTicks = this.generateMajorTicks(range, size);
    this.majorTicksLabelsSizes = this.measureLabelsSizesForMajorTicks(this.majorTicks);
  }

  protected updateMinorTicks(range: Range<DataType>){
    this.minorTicks = this.minorTicksGenerator?.generateTicks(range, this.majorTicks);
  }

  protected updateTicksScreenCoords(location: NumericPoint,
                                    range: Range<DataType>,
                                    size: Size){

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
  protected generateMajorTicks(range: Range<DataType>, size: Size): Array<Tick<DataType>> {
    let layout: LabelsLayout | undefined = undefined;
    let prevLayout;
    let prevTicksArrLength = -1;
    let ticksCount = this.majorTicksGenerator.defaultTicksCount;
    let attempt = 1;
    let ticks: Array<Tick<DataType>> = [];

    while(layout != LabelsLayout.OK) {
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
          layout = LabelsLayout.OK;
        }
        else {
          prevTicksArrLength = ticks.length;

          let labelsSizes = this.measureLabelsSizesForMajorTicks(ticks);

          prevLayout = layout;

          layout = this.evaluateLabelsLayout(this._size, labelsSizes, ticks, range);

          if (prevLayout == LabelsLayout.TooClose && layout == LabelsLayout.TooFar) {
            layout = LabelsLayout.OK;
          }
          if (layout != LabelsLayout.OK) {

            let prevTicksCount = ticksCount;

            if (layout == LabelsLayout.TooClose) {
              ticksCount = this.majorTicksGenerator.suggestDecreasedTickCount(ticksCount);
            } else {
              ticksCount = this.majorTicksGenerator.suggestIncreasedTicksCount(ticksCount);
            }
            if (ticksCount == 0 || prevTicksCount == ticksCount) {
              ticksCount = prevTicksCount;
              layout = LabelsLayout.OK;
            }
          }
        }
      }
    }

    return ticks;
  }

  /**
  * Evaluates labels layout for the axis (whether they overlap with each other or are too close).
  * Returns the result of labels layout evaluation.
  * @param {Size} axisSize - axis size;
  * @param {Array<Size>} ticksLabelsSizes - sizes of ticks labels;
  * @param {Array<Tick>} ticks - ticks.
  * @param {Range} range - axis range.
  * @returns {LabelsLayout}
  * */
  protected evaluateLabelsLayout(axisSize: Size, ticksLabelsSizes: Array<Size>, ticks: Array<Tick<DataType>>, range: Range<DataType>): LabelsLayout {
    let isAxisHorizontal = this.orientation == AxisOrientation.Horizontal;

    let ticksRenderInfo: Array<{coord: number, length: number }> = flow(
      partialRight(map, ((sizeTickTuple : {tick: Tick<DataType>, labelSize: Size})=>{
        return {
          coord: this.getTickScreenCoordinate(sizeTickTuple.tick, axisSize.width, axisSize.height, range),
          length: isAxisHorizontal ? sizeTickTuple.labelSize.width : sizeTickTuple.labelSize.height
        }
      })),
      partialRight(sortBy, ((i: {coord: number, length: number}) => i.coord)))(zipWith(ticksLabelsSizes, ticks, (size, tick) => { return {tick: tick, labelSize: size };}));


    let res = LabelsLayout.OK;

    for(let l = 0, r = 1; l < ticksRenderInfo.length, r < ticksRenderInfo.length - 1; l++, r++){
      let leftTick = ticksRenderInfo[l];
      let rightTick = ticksRenderInfo[r];

      if ((rightTick.coord - leftTick.coord) < (leftTick.length / 2 + rightTick.length / 2) * 2){
        res = LabelsLayout.TooClose;
        break;
      }
      else if ((rightTick.coord - leftTick.coord) > (leftTick.length / 2 + rightTick.length / 2) * 1.5){
        res = LabelsLayout.TooFar;
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

  private updateBorderShape() {
    this.borderShape.setAttrs({
      location: this.location,
      size: this.size
    });
  }

  protected updateTicksShape() {
    this.ticksShape.setAttrs({
      location: this.location,
      size: this.size,
      orientation: this.orientation,
      majorTicks: this.majorTicks,
      minorTicks: this.minorTicks,
      majorTicksScreenCoords: this.majorTicksScreenCoords,
      minorTicksScreenCoords: this.minorTicksScreenCoords
    });
  }
}
