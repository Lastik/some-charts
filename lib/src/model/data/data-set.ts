import {DimensionValue} from "./dimension-value";
import {ACEventTarget, DataRect, Range, Sorting} from "../index";
import {DataSetChangedEvent, DataSetEventType} from "./event";
import {DimensionType} from "./dimension-type";

export class DataSet<TItemType,
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined> {

  private _elements: Array<TItemType>;

  public readonly eventTarget: ACEventTarget<DataSetEventType>;

  public get elements(): ReadonlyArray<TItemType> {
    return this._elements;
  }

  private readonly metricsFuncs: { [name: string]: (item: TItemType) => number };
  private readonly dimensionXFunc: (item: TItemType) => XDimensionType;
  private readonly dimensionYFunc: ((item: TItemType) => Exclude<YDimensionType, undefined>) | undefined;
  private readonly dimensionXSorting: Sorting;

  private _dimensionXValues: DimensionValue<XDimensionType>[];
  private _dimensionYValues?: DimensionValue<Exclude<YDimensionType, undefined>>[];

  public get dimensionXValues(): readonly DimensionValue<XDimensionType>[] {
    return this._dimensionXValues;
  }

  public get dimensionYValues(): readonly DimensionValue<Exclude<YDimensionType, undefined>>[] | undefined {
    return this._dimensionYValues;
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

  public readonly metricsNames: ReadonlyArray<string>;

  constructor(elements: Array<TItemType>,
              metricsFuncs: { [name: string]: (item: TItemType) => number },
              dimensionXFunc: (item: TItemType) => XDimensionType,
              dimensionYFunc?: (item: TItemType) => Exclude<YDimensionType, undefined>,
              dimensionXSorting: Sorting = Sorting.Asc
  ) {

    this.eventTarget = new ACEventTarget<DataSetEventType>();

    this.metricsFuncs = metricsFuncs;
    this.dimensionXFunc = dimensionXFunc;
    this.dimensionYFunc = dimensionYFunc;
    this.dimensionXSorting = dimensionXSorting;

    this.metricsNames = Object.keys(metricsFuncs);

    this._elements = [];

    this._dimensionXValues = [];
    this._dimensionYValues = dimensionYFunc ? []: undefined;

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

  public getMetricRange(metricName: string) {

    let metricRange = this.metricsRanges.get(metricName);

    if (!metricRange) {
      let metricValues = this.metricsValues.get(metricName);

      if (metricValues) {

        let min = Number.MAX_VALUE;
        let max = Number.MIN_VALUE;

        if (this.is2D) {
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
        this.metricsRanges.set(metricName, metricRange);

      } else throw new Error("Failed to get metric value. Metric with specified name doesn't exist in this DataSet.")
    }

    return metricRange;
  }

  public getMetricValue(metricName: string, x: XDimensionType, y?: YDimensionType): number | undefined {
    if (y && !this.dimensionYFunc || !y && this.dimensionYFunc) {
      throw new Error("Failed to get metric value. Dimensions mismatch.")
    }

    let metricValues = this.metricsValues.get(metricName);

    let xIdx = this.indexByXDimension.get(new DimensionValue(x).primitiveValue);

    if (metricValues) {
      if (x && y) {
        let yIdx = this.indexByYDimension!.get(new DimensionValue(y).primitiveValue);
        return xIdx && yIdx ? (metricValues as Array<Array<number>>)[xIdx][yIdx] : undefined;
      } else {
        return xIdx ? (metricValues as Array<number>)[xIdx] : undefined;
      }
    } else throw new Error("Failed to get metric value. Metric with specified name doesn't exist in this DataSet.")
  }


  public getMetricValueForDimensions(metricName: string, xDimVal: DimensionValue<XDimensionType>, yDimVal: DimensionValue<Exclude<YDimensionType, undefined>> | undefined): number | undefined {
    if (yDimVal && !this.dimensionYFunc || !yDimVal && this.dimensionYFunc) {
      throw new Error("Failed to get metric value. Dimensions mismatch.")
    }

    let metricValues = this.metricsValues.get(metricName);

    if (metricValues) {
      if (xDimVal && yDimVal) {
        return (metricValues as Array<Array<number>>)[xDimVal.index][yDimVal.index];
      } else {
        return (metricValues as Array<number>)[xDimVal.index];
      }
    } else throw new Error("Failed to get metric value. Metric with specified name doesn't exist in this DataSet.")
  }

  public getMetricValues(metricName: string): Array<number | Array<number>> | undefined {
    return this.metricsValues.get(metricName);
  }

  /**
   * Updates elements to the specified DataSet.
   * For numeric or Date dimensions, the update operation can only add values larger than those already in the DataSet, or
   * override the existing values.
   * For string dimensions, there is no such rule.
   * */
  public update(elements: Array<TItemType>){

    this.metricsRanges.clear();

    this._elements = [...this._elements, ...elements];

    let maxDimensionXPrimitiveValue: number | undefined = undefined;
    let maxDimensionYPrimitiveValue: number | undefined = undefined;

    this.dimensionXValues.forEach(dimXVal => {
      if(typeof dimXVal.primitiveValue === 'number' && (!maxDimensionXPrimitiveValue || dimXVal.primitiveValue > maxDimensionXPrimitiveValue)){
        maxDimensionXPrimitiveValue = dimXVal.primitiveValue;
      }
    });

    if(this.dimensionYValues) {
      this.dimensionYValues.forEach(dimYVal => {
        if (typeof dimYVal.primitiveValue === 'number' && (!maxDimensionYPrimitiveValue || dimYVal.primitiveValue > maxDimensionYPrimitiveValue)) {
          maxDimensionYPrimitiveValue = dimYVal.primitiveValue;
        }
      });
    }

    let dimensionXValuesMap = new Map<number | string, DimensionValue<XDimensionType>>(
      this.dimensionXValues.map(v => [v.primitiveValue, v])
    );
    let dimensionYValuesMap = this.dimensionYFunc ? new Map<number | string, DimensionValue<Exclude<YDimensionType, undefined>>>(
      this.dimensionYValues!.map(v => [v.primitiveValue, v])
    ) : undefined;

    elements.forEach((element) => {
      let dimXValue = new DimensionValue(this.dimensionXFunc(element));
      let dimYValue = this.dimensionYFunc ? new DimensionValue(this.dimensionYFunc!(element)) : undefined;

      let errorTxt = 'For numeric or Date dimensions, update operation can only add values larger than those already inside DataSet (e.g. extend time series data) or override existing data.';

      if(!dimensionXValuesMap.has(dimXValue.primitiveValue) && maxDimensionXPrimitiveValue && dimXValue.primitiveValue < maxDimensionXPrimitiveValue){
        throw new Error(errorTxt)
      }

      dimensionXValuesMap.set(dimXValue.primitiveValue, dimXValue);
      if (dimYValue) {

        if(maxDimensionXPrimitiveValue && dimensionYValuesMap &&
          !dimensionYValuesMap.has(dimYValue.primitiveValue) && maxDimensionYPrimitiveValue && dimYValue.primitiveValue < maxDimensionXPrimitiveValue){
          throw new Error(errorTxt)
        }

        dimensionYValuesMap?.set(dimYValue.primitiveValue, dimYValue);
      }
    });

    this._dimensionXValues = Array.from(dimensionXValuesMap.values()).
      sort(DimensionValue.getCompareFunc(this.dimensionXSorting)).
      map((dv, i) => dv.withIndex(i));
    this._dimensionYValues = dimensionYValuesMap ?
      Array.from(dimensionYValuesMap.values()).
        sort(DimensionValue.getCompareFunc()).
        map((dv, i) => dv.withIndex(i)) :
      undefined;

    this.indexByXDimension = new Map(this._dimensionXValues.map((dv) => [dv.primitiveValue, dv.index]));
    this.indexByYDimension = this._dimensionYValues ? new Map(this._dimensionYValues.map((dv) => [dv.primitiveValue, dv.index])) : undefined;

    for (let metricName in this.metricsFuncs) {

      let metricValues: Array<number | Array<number>> = this.metricsValues.get(metricName) ?? Array(this._dimensionXValues.length);

      if(!this.metricsValues.has(metricName)){
        if (this._dimensionYValues) {
          for (let i = 0; i < this._dimensionXValues.length; i++) {
            metricValues[i] = Array(this._dimensionYValues.length)
          }
        }
        this.metricsValues.set(metricName, metricValues);
      }

      let metricFunc = this.metricsFuncs[metricName];

      elements.forEach((element, index) => {
        let dimXValue = new DimensionValue(this.dimensionXFunc(element));
        let dimYValue = this.dimensionYFunc ? new DimensionValue(this.dimensionYFunc!(element)) : undefined;

        let xIdx = this.indexByXDimension.get(dimXValue.primitiveValue);
        let yIdx = this.indexByYDimension && dimYValue ? this.indexByYDimension.get(dimYValue.primitiveValue) : undefined;

        let metricValue = metricFunc(element);

        if (xIdx && yIdx && Array.isArray(metricValues[xIdx])) {
          let twoDMetricValues = (metricValues as Array<Array<number>>);
          if(!twoDMetricValues[xIdx]) {
            twoDMetricValues[xIdx] = [];
          }
          twoDMetricValues[xIdx][yIdx] = metricValue;
        } else if (xIdx) {
          let oneDMetricValues = (metricValues as Array<number>);
          oneDMetricValues[xIdx] = metricValue;
        }
      });
    }

    let firstDimXValue = this.dimensionXValues.length ? this.dimensionXValues[0].value : undefined;
    this._dimensionXType = this.getDimensionType(firstDimXValue);

    let secondDimXValue = this.dimensionYValues && this.dimensionYValues.length ? this.dimensionYValues[0].value : undefined;
    this._dimensionYType = this.getDimensionType(secondDimXValue);

    this.eventTarget.fireEvent(new DataSetChangedEvent());
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

  private clearInternal(triggerChange: boolean){
    this._elements = [];

    this._dimensionXValues = [];
    this._dimensionYValues = this.dimensionYFunc ? [] : undefined;

    this.metricsValues = new Map<string, Array<number | Array<number>>>();

    this.indexByXDimension = new Map<number | string, number>();
    this.indexByYDimension = this.dimensionYFunc ? new Map<number | string, number>() : undefined;
    if(triggerChange){
      this.eventTarget.fireEvent(new DataSetChangedEvent());
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
   * Calculates bounding rectangle of the data inside this DataSet.
   * @returns {DataRect}
   */
  getBoundingRectangle(): DataRect | undefined {
    let boundingRect: DataRect | undefined = undefined;

    for (let metricName in this.metricsNames) {

      let curMetricBoundingRect: DataRect | undefined = undefined;

      if (this.dimensionXValues.length) {
        let minX = this.dimensionXValues[0];
        let maxX = this.dimensionXValues[this.dimensionXValues.length - 1];

        if (this.is1D) {
          let minY = this.getMetricValue(metricName, minX.value);
          let maxY = this.getMetricValue(metricName, maxX.value);

          if (minY && maxY) {
            curMetricBoundingRect = new DataRect(minX.toNumericValue(), minY, maxX.toNumericValue() - minX.toNumericValue(), maxY - minY);
          }
        } else {
          if (this.dimensionYValues && this.dimensionYValues.length) {
            let minY = this.dimensionYValues[0];
            let maxY = this.dimensionYValues[this.dimensionYValues.length - 1];

            curMetricBoundingRect = new DataRect(
              minX.toNumericValue(),
              minY.toNumericValue(),
              maxX.toNumericValue() - minX.toNumericValue(),
              maxY.toNumericValue() - minY.toNumericValue());
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
}
