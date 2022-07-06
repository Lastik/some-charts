import {DimensionValue} from "./dimension-value";

export class DataSet<TItemType,
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date> {

  public readonly elements: Array<TItemType>;

  private readonly metricsFuncs: { [name: string]: (item: TItemType) => number };
  private readonly dimensionXFunc: (item: TItemType) => XDimensionType;
  private readonly dimensionYFunc: ((item: TItemType) => YDimensionType) | undefined;

  public readonly dimensionXValues: DimensionValue<XDimensionType>[];
  public readonly dimensionYValues?: DimensionValue<YDimensionType>[];

  private readonly indexByXDimension: Map<number | string, number>;
  private readonly indexByYDimension: Map<number | string, number> | undefined;

  private metricsValues: Map<string, Array<number | Array<number>>>;

  constructor(elements: Array<TItemType>,
              metricsFuncs: {[name: string]: (item: TItemType) => number},
              dimensionXFunc: (item: TItemType) => XDimensionType,
              dimensionYFunc?: (item: TItemType) => YDimensionType,
              ) {
    this.elements = elements;
    this.metricsFuncs = metricsFuncs;
    this.dimensionXFunc = dimensionXFunc;
    this.dimensionYFunc = dimensionYFunc;

    this.metricsValues = new Map<string, Array<number | Array<number>>>();

    let dimensionXValuesMap = new Map<number | string, DimensionValue<XDimensionType>>();
    let dimensionYValuesMap = this.dimensionYFunc ? new Map<number | string, DimensionValue<YDimensionType>>() : undefined;

    this.elements.forEach((element, index) => {
      let dimXValue = new DimensionValue(this.dimensionXFunc(element));
      let dimYValue = this.dimensionYFunc ? new DimensionValue(this.dimensionYFunc!(element)) : undefined;

      dimensionXValuesMap.set(dimXValue.primitiveValue, dimXValue);
      if(dimYValue){
        dimensionYValuesMap?.set(dimYValue.primitiveValue, dimYValue);
      }
    });

    this.dimensionXValues = Array.from(dimensionXValuesMap.values());
    this.dimensionYValues = dimensionYValuesMap ? Array.from(dimensionYValuesMap.values()): undefined;

    this.indexByXDimension = new Map(this.dimensionXValues.map((v, i) => [v.primitiveValue, i]));
    this.indexByYDimension = this.dimensionYValues ? new Map(this.dimensionYValues.map((v, i) => [v.primitiveValue, i])) : undefined;

    for (let metricName in this.metricsFuncs) {
      let metricValues: Array<number | Array<number>> = Array(this.dimensionXValues.length);
      if (this.dimensionYValues) {
        for (let i = 0; i < this.dimensionXValues.length; i++) {
          metricValues[i] = Array(this.dimensionYValues.length)
        }
      }
      this.metricsValues.set(metricName, metricValues);

      let metricFunc = this.metricsFuncs[metricName];

      this.elements.forEach((element, index) => {
        let dimXValue = new DimensionValue(this.dimensionXFunc(element));
        let dimYValue = this.dimensionYFunc ? new DimensionValue(this.dimensionYFunc!(element)) : undefined;

        let xIdx = this.indexByXDimension.get(dimXValue.primitiveValue);
        let yIdx = this.indexByYDimension && dimYValue ? this.indexByYDimension.get(dimYValue.primitiveValue) : undefined;

        let metricValue = metricFunc(element);

        if (xIdx && yIdx && Array.isArray(metricValues[xIdx])) {
          (<Array<Array<number>>>metricValues)[xIdx][yIdx] = metricValue;
        } else if (xIdx) {
          (<Array<number>>metricValues)[xIdx] = metricValue;
        }
      });
    }
  }

  public get is1D(): boolean {
    return this.dimensionYFunc === undefined;
  }

  public get is2D(): boolean {
    return this.dimensionYFunc !== undefined;
  }

  public getMetricValue(metricName: string, x: XDimensionType, y?: YDimensionType): number | undefined {

    if(y && !this.dimensionYFunc || !y && this.dimensionYFunc){
      throw new Error("Failed to get metric value. Dimensions mismatch.")
    }

    let metricValues = this.metricsValues.get(metricName);

    let xIdx = this.indexByXDimension.get(new DimensionValue(x).primitiveValue);

    if(metricValues){
      if (x && y) {
        let yIdx = this.indexByYDimension && dimYValue ? this.indexByYDimension.get(dimYValue.primitiveValue) : undefined;

        (<Array<Array<number>>>metricValues)[xIdx][yIdx] = metricValue;
      } else if (xIdx) {
        (<Array<number>>metricValues)[xIdx] = metricValue;
      }
    }


  }
}
