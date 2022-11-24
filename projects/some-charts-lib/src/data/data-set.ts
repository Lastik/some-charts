import {DimensionValue} from "./dimension-value";
import {ACEventTarget} from "../events";
import {NumericDataRect, Range} from "../geometry";
import {DataSetChangedEvent, DataSetEventType} from "./event";
import {DimensionType} from "./dimension-type";
import {Sorting} from "../sorting";
import isUndefined from "lodash-es/isUndefined";
import min from "lodash-es/min";
import max from "lodash-es/max";
import {DataSetChange, DataSetChange1D, DataSetChange2D} from "./data-set-change";

export class DataSet<TItemType,
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined> {

  public readonly eventTarget: ACEventTarget<DataSetEventType>;

  private readonly metrics: { [id: string]: Metric<TItemType>};

  private readonly dimensionXFunc: (item: TItemType) => XDimensionType;
  private readonly dimensionYFunc: ((item: TItemType) => Exclude<YDimensionType, undefined>) | undefined;
  private readonly dimensionsSorting: Sorting;

  private _dimensionXValues: DimensionValue<XDimensionType>[];
  private _dimensionYValues?: DimensionValue<Exclude<YDimensionType, undefined>>[];
  private _dimensionsValues: DimensionValue<XDimensionType>[] | [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][];

  public get dimensionXValues(): readonly DimensionValue<XDimensionType>[] {
    return this._dimensionXValues;
  }

  public get dimensionYValues(): readonly DimensionValue<Exclude<YDimensionType, undefined>>[] | undefined {
    return this._dimensionYValues;
  }

  public get dimensionsValues(): readonly DimensionValue<XDimensionType>[] | readonly [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][] {
    return this._dimensionsValues;
  }

  private metricsRanges: Map<string, Range<number>> = new Map<string, Range<number>>();

  private _dimensionXType: DimensionType | undefined;
  private _dimensionYType: DimensionType | undefined;

  public get dimensionXType(){
    return this._dimensionXType;
  }

  public get dimensionYType(){
    return this._dimensionYType;
  }

  private indexByXDimension: Map<number | string, number>;
  private indexByYDimension: Map<number | string, number> | undefined;

  private metricsValues: Map<string, Array<number | Array<number>>>;

  public readonly metricsIds: ReadonlyArray<string>;

  constructor(elements: Array<TItemType>,
              metrics: { [id: string]: Metric<TItemType>},
              dimensionXFunc: (item: TItemType) => XDimensionType,
              dimensionYFunc?: (item: TItemType) => Exclude<YDimensionType, undefined>,
              dimensionsSorting: Sorting = Sorting.Asc
  ) {

    this.eventTarget = new ACEventTarget<DataSetEventType>();

    this.metrics = metrics;

    this.dimensionXFunc = dimensionXFunc;
    this.dimensionYFunc = dimensionYFunc;
    this.dimensionsSorting = dimensionsSorting;

    this.metricsIds = Object.keys(metrics);

    this._dimensionXValues = [];
    this._dimensionYValues = dimensionYFunc ? []: undefined;
    this._dimensionsValues = [];

    this.metricsValues = new Map<string, Array<number | Array<number>>>();

    this.indexByXDimension = new Map<number | string, number>();
    this.indexByYDimension = dimensionYFunc ? new Map<number | string, number>(): undefined;

    this.update(elements);
  }

  public get is1D(): boolean {
    return this.dimensionYFunc === undefined;
  }

  public get is2D(): boolean {
    return this.dimensionYFunc !== undefined;
  }

  public isSingleMetricValue(metricId: string): boolean {
    return !this.metrics[metricId]?.isArrayLike;
  }

  public isArrayMetricValue(metricId: string): boolean {
    return !!this.metrics[metricId]?.isArrayLike;
  }

  public getMetricRange(metricId: string) {

    let metricRange = this.metricsRanges.get(metricId);

    if (!metricRange) {
      let metricValues = this.metricsValues.get(metricId);

      if (metricValues) {

        let min = Number.MAX_VALUE;
        let max = Number.MIN_VALUE;

        if (this.is2D || this.isArrayMetricValue(metricId)) {
          let metricValues2D = <number[][]>metricValues;

          for (let i = 0; i < metricValues2D.length; i++) {
            for (let j = 0; j < metricValues2D[0].length; j++) {
              min = Math.min(metricValues2D[i][j], min);
              max = Math.max(metricValues2D[i][j], max);
            }
          }
        } else {
          let metricValues1D = <number[]>metricValues;

          for (let i = 0; i < metricValues1D.length; i++) {
            min = Math.min(metricValues1D[i], min);
            max = Math.max(metricValues1D[i], max);
          }
        }

        metricRange = new Range<number>(min, max);
        this.metricsRanges.set(metricId, metricRange);

      } else throw new Error("Failed to get metric value. Metric with specified name doesn't exist in this DataSet.")
    }

    return metricRange;
  }

  public getMetricValue(metricId: string, x: XDimensionType, y?: YDimensionType): number | Array<number> | undefined {
    if (!isUndefined(y) && !this.dimensionYFunc || isUndefined(y) && this.dimensionYFunc) {
      throw new Error("Failed to get metric value. Dimensions mismatch.")
    }

    let metricValues = this.metricsValues.get(metricId);

    let xIdx = this.indexByXDimension.get(new DimensionValue(x).primitiveValue);

    if (metricValues) {
      if (!isUndefined(y)) {
        let yIdx = this.indexByYDimension!.get(new DimensionValue(y).primitiveValue);
        return !isUndefined(xIdx) && !isUndefined(yIdx) ? (metricValues as Array<Array<number | Array<number>>>)[xIdx][yIdx] : undefined;
      } else {
        return !isUndefined(xIdx) ? (metricValues as Array<number | Array<number>>)[xIdx] : undefined;
      }
    } else throw new Error("Failed to get metric value. Metric with specified name doesn't exist in this DataSet.")
  }


  public getMetricValueForDimensions(metricId: string, xDimVal: DimensionValue<XDimensionType>, yDimVal: DimensionValue<Exclude<YDimensionType, undefined>> | undefined): number | Array<number> | undefined {
    if (yDimVal && !this.dimensionYFunc || !yDimVal && this.dimensionYFunc) {
      throw new Error("Failed to get metric value. Dimensions mismatch.")
    }

    let metricValues = this.metricsValues.get(metricId);

    if (metricValues) {
      if (!isUndefined(xDimVal) && !isUndefined(yDimVal)) {
        return (metricValues as Array<Array<number | Array<number>>>)[xDimVal.index][yDimVal.index];
      } else {
        return (metricValues as Array<number | Array<number>>)[xDimVal.index];
      }
    } else throw new Error("Failed to get metric value. Metric with specified name doesn't exist in this DataSet.")
  }

  public getMetricValues(metricId: string): Array<number | Array<number>> | undefined {
    return this.metricsValues.get(metricId);
  }

  public getSingleMetricValue(metricId: string, x: XDimensionType, y?: YDimensionType): number | undefined {
    if (this.isSingleMetricValue(metricId)) {
      return this.getMetricValue(metricId, x, y) as number | undefined;
    } else throw DataSet.buildMetricIsNotSingleError(metricId);
  }

  public getArrayMetricValue(metricId: string, x: XDimensionType, y?: YDimensionType): Array<number> | undefined {
    if (this.isArrayMetricValue(metricId)) {
      return this.getMetricValue(metricId, x, y) as Array<number> | undefined;
    } else throw DataSet.buildMetricIsNotArrayError(metricId);
  }

  public getSingleMetricValueForDimensions(metricId: string, xDimVal: DimensionValue<XDimensionType>, yDimVal: DimensionValue<Exclude<YDimensionType, undefined>> | undefined): number | undefined {
    if (this.isSingleMetricValue(metricId)) {
      return this.getMetricValueForDimensions(metricId, xDimVal, yDimVal) as number | undefined;
    } else throw DataSet.buildMetricIsNotSingleError(metricId);
  }

  public getSingleMetricValues(metricId: string): Array<number | Array<number>> | undefined {
    if (this.isSingleMetricValue(metricId)) {
      return this.metricsValues.get(metricId);
    } else throw DataSet.buildMetricIsNotSingleError(metricId);
  }

  /**
   * Updates elements to the specified DataSet.
   * For numeric or Date dimensions, the update operation can only add values larger than those already in the DataSet, or
   * override the existing values.
   * For string dimensions, there is no such rule.
   * */
  public update(elements: Array<TItemType>) {

    this.metricsRanges.clear();

    let dimensionXPrevMaxNumeric: number | undefined = undefined;
    let dimensionYPrevMaxNumeric: number | undefined = undefined;

    this.dimensionXValues.forEach(dimXVal => {
      if (typeof dimXVal.primitiveValue === 'number' && (!dimensionXPrevMaxNumeric || dimXVal.primitiveValue > dimensionXPrevMaxNumeric)) {
        dimensionXPrevMaxNumeric = dimXVal.primitiveValue;
      }
    });

    if (this.dimensionYValues) {
      this.dimensionYValues.forEach(dimYVal => {
        if (typeof dimYVal.primitiveValue === 'number' && (!dimensionYPrevMaxNumeric || dimYVal.primitiveValue > dimensionYPrevMaxNumeric)) {
          dimensionYPrevMaxNumeric = dimYVal.primitiveValue;
        }
      });
    }

    let dimensionXMinNumeric: number | undefined = undefined;
    let dimensionYMinNumeric: number | undefined = undefined;

    let dimensionXValuesMap = new Map<number | string, DimensionValue<XDimensionType>>(
      this.dimensionXValues.map(v => [v.primitiveValue, v])
    );
    let dimensionYValuesMap = this.dimensionYFunc ? new Map<number | string, DimensionValue<Exclude<YDimensionType, undefined>>>(
      this.dimensionYValues!.map(v => [v.primitiveValue, v])
    ) : undefined;

    let dimensionsXYValues: [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][] = [];

    elements.forEach((element, index) => {
      let dimXValue = new DimensionValue(this.dimensionXFunc(element), index);
      let dimYValue = this.dimensionYFunc ? new DimensionValue(this.dimensionYFunc!(element), index) : undefined;

      let errorTxt = 'For numeric or Date dimensions, update operation can only add values larger than those already inside DataSet (e.g. extend time series data) or override existing data.';

      if (!dimensionXValuesMap.has(dimXValue.primitiveValue) && !isUndefined(dimensionXPrevMaxNumeric) && dimXValue.primitiveValue < dimensionXPrevMaxNumeric) {
        throw new Error(errorTxt)
      }

      if (typeof dimXValue.primitiveValue === 'number' && (!dimensionXMinNumeric || dimensionXMinNumeric > dimXValue.primitiveValue)) {
        dimensionXMinNumeric = dimXValue.primitiveValue;
      }

      dimensionXValuesMap.set(dimXValue.primitiveValue, dimXValue);
      if (dimYValue) {

        if (!isUndefined(dimensionXPrevMaxNumeric) && dimensionYValuesMap &&
          !dimensionYValuesMap.has(dimYValue.primitiveValue) && dimensionYPrevMaxNumeric && dimYValue.primitiveValue < dimensionXPrevMaxNumeric) {
          throw new Error(errorTxt)
        }

        if (typeof dimYValue.primitiveValue === 'number' && (!dimensionYMinNumeric || dimensionYMinNumeric > dimYValue.primitiveValue)) {
          dimensionYMinNumeric = dimYValue.primitiveValue;
        }

        dimensionYValuesMap?.set(dimYValue.primitiveValue, dimYValue);
      }

      if(this.dimensionYFunc) {
        dimensionsXYValues.push([dimXValue, dimYValue!]);
      }
    });

    this._dimensionXValues = Array.from(dimensionXValuesMap.values())
      .filter(v => (dimensionXMinNumeric === undefined || typeof v.primitiveValue !== 'number' || v.primitiveValue >= dimensionXMinNumeric))
      .sort(DimensionValue.getCompareFunc(this.dimensionsSorting))
      .map((dv, i) => dv.withIndex(i));
    this._dimensionYValues = dimensionYValuesMap ?
      Array.from(dimensionYValuesMap.values())
        .filter(v => (dimensionYMinNumeric === undefined || typeof v.primitiveValue !== 'number' || v.primitiveValue >= dimensionYMinNumeric))
        .sort(DimensionValue.getCompareFunc())
        .map((dv, i) => dv.withIndex(i)) :
      undefined;

    this.indexByXDimension = new Map(this._dimensionXValues.map((dv) => [dv.primitiveValue, dv.index]));
    this.indexByYDimension = this._dimensionYValues ? new Map(this._dimensionYValues.map((dv) => [dv.primitiveValue, dv.index])) : undefined;

    let prevDimensionsValues = this._dimensionsValues;

    if(this.dimensionYFunc) {
      dimensionsXYValues = dimensionsXYValues.
      filter(dv => {
        return (dimensionXMinNumeric === undefined || typeof dv[0].primitiveValue !== 'number' || dv[0].primitiveValue >= dimensionXMinNumeric) &&
          (dimensionYMinNumeric === undefined || typeof dv[1].primitiveValue !== 'number' || dv[1].primitiveValue >= dimensionYMinNumeric)
      }).
      sort(DimensionValue.getCompareFunc2D(this.dimensionsSorting)).
      map((dv, i) => {
        return [
          dv[0].primitiveValue ? dv[0].withIndex(this.indexByXDimension.get(dv[0].primitiveValue)!) : dv[0],
          dv[1].primitiveValue ? dv[1].withIndex(this.indexByXDimension.get(dv[1].primitiveValue)!) : dv[1]
        ];
      });
      this._dimensionsValues = dimensionsXYValues;
    }
    else {
      this._dimensionsValues = this._dimensionXValues;
    }

    let dataSetChange: DataSetChange<XDimensionType, YDimensionType> = DataSetChange.fromDataSetDimensionsUpdate(prevDimensionsValues, this._dimensionsValues);

    let indexXOffset = dimensionXValuesMap.size - this._dimensionXValues.length;
    let indexYOffset = dimensionYValuesMap && this._dimensionYValues ? (dimensionYValuesMap.size - this._dimensionYValues.length) : undefined;

    for (let metricId in this.metrics) {

      let metricValues: Array<number | Array<number>> = this.metricsValues.get(metricId) ?? Array(this._dimensionXValues.length);

      if (!this.metricsValues.has(metricId)) {
        if (this._dimensionYValues) {
          for (let i = 0; i < this._dimensionXValues.length; i++) {
            metricValues[i] = Array(this._dimensionYValues.length)
          }
        }
        this.metricsValues.set(metricId, metricValues);
      } else {
        metricValues.splice(0, indexXOffset);
        if (indexYOffset) {
          for (let i = 0; i < metricValues.length; i++) {
            if (Array.isArray(metricValues[i])) {
              let metricValuesInnerArr = (metricValues[i] as Array<number>);
              metricValuesInnerArr.splice(0, indexYOffset)
            }
          }
        }
      }

      let metricFunc = this.metrics[metricId]?.func;

      elements.forEach((element, index) => {
        let dimXValue = new DimensionValue(this.dimensionXFunc(element), index);
        let dimYValue = this.dimensionYFunc ? new DimensionValue(this.dimensionYFunc!(element), index) : undefined;

        let xIdx = this.indexByXDimension.get(dimXValue.primitiveValue);
        let yIdx = this.indexByYDimension && dimYValue ? this.indexByYDimension.get(dimYValue.primitiveValue) : undefined;

        let metricValue = metricFunc(element);

        if(this.isArrayMetricValue(metricId)) {
          metricValue = (metricValue as number[]).sort(function (l, r) {
            return l - r;
          });
        }

        if (!isUndefined(xIdx) && !isUndefined(yIdx) && Array.isArray(metricValues[xIdx])) {
          let twoDMetricValues = (metricValues as Array<Array<number>>);
          if (!twoDMetricValues[xIdx]) {
            twoDMetricValues[xIdx] = [];
          }

          if(Array.isArray(metricValue)){
            throw new Error('DataSet doesn\'t support 2D metrics with array of values');
          }

          twoDMetricValues[xIdx][yIdx] = metricValue as number;
        } else if (!isUndefined(xIdx)) {
          let oneDMetricValues = (metricValues as Array<number | Array<number>>);
          oneDMetricValues[xIdx] = metricValue;
        }
      });
    }

    let firstDimXValue = this.dimensionXValues.length ? this.dimensionXValues[0].value : undefined;
    this._dimensionXType = this.getDimensionType(firstDimXValue);

    let secondDimXValue = this.dimensionYValues && this.dimensionYValues.length ? this.dimensionYValues[0].value : undefined;
    this._dimensionYType = this.getDimensionType(secondDimXValue);

    this.eventTarget.fireEvent(new DataSetChangedEvent(
      dataSetChange));
  }

  /**
   * Clears this DataSet.
   * */
  public clear() {
    this.clearInternal(true);
  }

  /**
   * Replaces content of the DataSet with specified array of elements.
   * */
  public replace(elements: Array<TItemType>){
    this.clearInternal(false);
    this.update(elements);
  }

  private clearInternal(triggerChange: boolean) {

    this._dimensionXValues = [];
    this._dimensionYValues = this.dimensionYFunc ? [] : undefined;

    this.metricsValues = new Map<string, Array<number | Array<number>>>();

    this.indexByXDimension = new Map<number | string, number>();
    this.indexByYDimension = this.dimensionYFunc ? new Map<number | string, number>() : undefined;
    if (triggerChange) {
      let dataSetChange = this.is1D?
        new DataSetChange1D(this.dimensionXValues, [], []):
        new DataSetChange2D(this.dimensionsValues as readonly [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][], [], [])

      this.eventTarget.fireEvent(new DataSetChangedEvent(dataSetChange));
    }
  }

  protected getDimensionType(firstDimValue: number | string | Date | undefined): DimensionType | undefined {
    if(firstDimValue) {
      if (typeof firstDimValue === 'string') {
        return DimensionType.String;
      } else if (typeof firstDimValue === 'number') {
        return DimensionType.Number;
      } else {
        return DimensionType.Date;
      }
    }
    else return undefined;
  }

  /**
   * Convert value on X axis to it's numeric counterpart
   * @template XDimensionType
   * @param {XDimensionType} value - value of X dimension
   * @returns number
   * */
  xDimensionValueToNumeric(value: XDimensionType): number | undefined {
    return value ?
      new DimensionValue(value, this.indexByXDimension?.get(DimensionValue.makePrimitive(value))).toNumericValue() :
      undefined;
  }

  /**
   * Convert value on Y axis to it's numeric counterpart
   * @template YDimensionType
   * @param {YDimensionType} value - value of Y dimension
   * @returns number
   * */
  yDimensionValueToNumeric(value: YDimensionType): number | undefined {
    return value ?
      new DimensionValue(value, this.indexByYDimension?.get(DimensionValue.makePrimitive(value))).toNumericValue() :
      undefined;
  }


  /**
   * Convert numeric value to value on X axis
   * @template XDimensionType
   * @param {number} value - value of X dimension
   * @returns XDimensionType
   * */
  numericToXDimensionValue(value: number): XDimensionType | undefined {
    if (this._dimensionXType === DimensionType.Date) {
      return DimensionValue.buildForDateFromPrimitive(value).value as XDimensionType;
    } else if (this._dimensionXType === DimensionType.Number) {
      return value as XDimensionType;
    } else if (this._dimensionYType === DimensionType.String) {
      return this._dimensionXValues.find(v => v.index === value)?.value;
    } else {
      return value as XDimensionType;
    }
  }

  /**
   * Convert numeric value to value on X axis
   * @template YDimensionType
   * @param {number} value - value of X dimension
   * @returns YDimensionType
   * */
  numericToYDimensionValue(value: number): YDimensionType | undefined {
    if (this._dimensionYType === DimensionType.Date) {
      return DimensionValue.buildForDateFromPrimitive(value).value as YDimensionType;
    } else if (this._dimensionYType === DimensionType.Number) {
      return value as YDimensionType;
    } else if (this._dimensionYType === DimensionType.String) {
      return this._dimensionYValues?.find(v => v.index === value)?.value;
    } else {
      return value as YDimensionType;
    }
  }

  /**
   * Calculates bounding rectangle for the specified metrics of this DataSet.
   * @param {Array<string>} metricsIds - ids of metrics to take into consideration.
   * @returns {NumericDataRect}
   */
  getBoundingRectangle(metricsIds: Array<string>): NumericDataRect | undefined {
    let boundingRect: NumericDataRect | undefined = undefined;

    for (let metricId of metricsIds) {

      let curMetricBoundingRect: NumericDataRect | undefined = undefined;

      if (this.dimensionXValues.length) {
        let minX = this.dimensionXValues[0].toNumericValue();
        let maxX = this.dimensionXValues[this.dimensionXValues.length - 1].toNumericValue();

        if (this.is1D) {

          let yValues = this.getMetricValues(metricId) as number[];

          let minY = min(yValues);
          let maxY = max(yValues);

          if (!isUndefined(minY) && !isUndefined(maxY)) {
            curMetricBoundingRect = new NumericDataRect(minX, maxX, minY, maxY);
          }
        } else {
          if (this.dimensionYValues && this.dimensionYValues.length) {

            let dimensionYNumericValues = this.dimensionYValues.map(v => v.toNumericValue());

            let minY = min(dimensionYNumericValues);
            let maxY = max(dimensionYNumericValues);

            if (!isUndefined(minY) && !isUndefined(maxY)) {
              curMetricBoundingRect = new NumericDataRect(minX, maxX, minY, maxY);
            }
          }
        }
      }

      if (curMetricBoundingRect) {
        if (boundingRect) {
          boundingRect = boundingRect.merge(curMetricBoundingRect);
        } else {
          boundingRect = curMetricBoundingRect;
        }
      }
    }

    return boundingRect;
  }

  private static buildMetricIsNotSingleError(metricId: string): Error{
    return new Error(`DataSet metric ${metricId} is not single!`)
  }

  private static buildMetricIsNotArrayError(metricId: string): Error{
    return new Error(`DataSet metric ${metricId} is not array!`)
  }
}

type Metric<TItemType> = {func: (item: TItemType) => number | Array<number>, isArrayLike?: boolean };
