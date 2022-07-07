import {DimensionValue} from "./dimension-value";

export class DataSet<TItemType,
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date> {

  private _elements: Array<TItemType>;

  public get elements(): ReadonlyArray<TItemType> {
    return this._elements;
  }

  private readonly metricsFuncs: { [name: string]: (item: TItemType) => number };
  private readonly dimensionXFunc: (item: TItemType) => XDimensionType;
  private readonly dimensionYFunc: ((item: TItemType) => YDimensionType) | undefined;

  private _dimensionXValues: DimensionValue<XDimensionType>[];
  private _dimensionYValues?: DimensionValue<YDimensionType>[];

  public get dimensionXValues(): readonly DimensionValue<XDimensionType>[] {
    return this._dimensionXValues;
  }

  public get dimensionYValues(): readonly DimensionValue<YDimensionType>[] | undefined {
    return this._dimensionYValues;
  }

  private indexByXDimension: Map<number | string, number>;
  private indexByYDimension: Map<number | string, number> | undefined;

  private metricsValues: Map<string, Array<number | Array<number>>>;

  constructor(elements: Array<TItemType>,
              metricsFuncs: { [name: string]: (item: TItemType) => number },
              dimensionXFunc: (item: TItemType) => XDimensionType,
              dimensionYFunc?: (item: TItemType) => YDimensionType,
  ) {
    this.metricsFuncs = metricsFuncs;
    this.dimensionXFunc = dimensionXFunc;
    this.dimensionYFunc = dimensionYFunc;

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

  public getMetricValue(metricName: string, x: XDimensionType, y?: YDimensionType): number | undefined {
    if (y && !this.dimensionYFunc || !y && this.dimensionYFunc) {
      throw new Error("Failed to get metric value. Dimensions mismatch.")
    }

    let metricValues = this.metricsValues.get(metricName);

    let xIdx = this.indexByXDimension.get(new DimensionValue(x).primitiveValue);

    if (metricValues) {
      if (x && y) {
        let yIdx = this.indexByYDimension!.get(new DimensionValue(y).primitiveValue);
        return xIdx && yIdx ? (<Array<Array<number>>>metricValues)[xIdx][yIdx] : undefined;
      } else {
        return xIdx ? (<Array<number>>metricValues)[xIdx] : undefined;
      }
    }
    else throw new Error("Failed to get metric value. Metric with specified name doesn't exist in this DataSet.")
  }

  public getMetricValues(metricName: string): Array<number | Array<number>> | undefined {
    return this.metricsValues.get(metricName);
  }

  public update(elements: Array<TItemType>){

    this._elements = [...this._elements, ...elements];

    let dimensionXValuesMap = new Map<number | string, DimensionValue<XDimensionType>>(
      this.dimensionXValues.map(v => [v.primitiveValue, v])
    );
    let dimensionYValuesMap = this.dimensionYFunc ? new Map<number | string, DimensionValue<YDimensionType>>(
      this.dimensionYValues!.map(v => [v.primitiveValue, v])
    ) : undefined;

    elements.forEach((element) => {
      let dimXValue = new DimensionValue(this.dimensionXFunc(element));
      let dimYValue = this.dimensionYFunc ? new DimensionValue(this.dimensionYFunc!(element)) : undefined;

      dimensionXValuesMap.set(dimXValue.primitiveValue, dimXValue);
      if (dimYValue) {
        dimensionYValuesMap?.set(dimYValue.primitiveValue, dimYValue);
      }
    });

    this._dimensionXValues = Array.from(dimensionXValuesMap.values());
    this._dimensionYValues = dimensionYValuesMap ? Array.from(dimensionYValuesMap.values()) : undefined;

    this.indexByXDimension = new Map(this._dimensionXValues.map((v, i) => [v.primitiveValue, i]));
    this.indexByYDimension = this._dimensionYValues ? new Map(this._dimensionYValues.map((v, i) => [v.primitiveValue, i])) : undefined;

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
          let twoDMetricValues = (<Array<Array<number>>>metricValues);
          if(!twoDMetricValues[xIdx]) {
            twoDMetricValues[xIdx] = [];
          }
          twoDMetricValues[xIdx][yIdx] = metricValue;
        } else if (xIdx) {
          let oneDMetricValues = (<Array<number>>metricValues);
          oneDMetricValues[xIdx] = metricValue;
        }
      });
    }
  }

  public clear() {
    this._elements = [];

    this._dimensionXValues = [];
    this._dimensionYValues = this.dimensionYFunc ? [] : undefined;

    this.metricsValues = new Map<string, Array<number | Array<number>>>();

    this.indexByXDimension = new Map<number | string, number>();
    this.indexByYDimension = this.dimensionYFunc ? new Map<number | string, number>() : undefined;
  }
}
