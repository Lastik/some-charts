export class DataSet<TItemType,
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date> {

  public readonly elements: Array<TItemType>;

  private readonly metricsFuncs: { [name: string]: (item: TItemType) => number };
  private readonly dimensionXFunc: (item: TItemType) => XDimensionType;
  private readonly dimensionYFunc?: ((item: TItemType) => YDimensionType);

  public readonly dimensionXValues: XDimensionType[];
  public readonly dimensionYValues: YDimensionType[] | undefined;

  private readonly indexByXDimension: Map<number | string, number>;
  private readonly indexByYDimension: Map<number | string, number>;

  private metricsValues: Map<string, Array<Array<number>>>;

  constructor(elements: Array<TItemType>,
              metricsFuncs: {[name: string]: (item: TItemType) => number},
              dimensionXFunc: (item: TItemType) => XDimensionType,
              dimensionYFunc?: (item: TItemType) => YDimensionType,
              ) {
    this.elements = elements;
    this.metricsFuncs = metricsFuncs;
    this.dimensionXFunc = dimensionXFunc;
    this.dimensionYFunc = dimensionYFunc;

    this.metricsValues = new Map<string, Array<Array<number>>>();

    let dimensionXValuesSet = [];
    let dimensionYValuesSet = this.dimensionYFunc ? [] : undefined;

    this.elements.forEach((element, index) => {

      let dimXValue = this.dimensionXFunc(element);
      let dimYValue = this.dimensionYFunc ? (this.dimensionYFunc!(element)) | undefined;

      //TODO: unique.

      //dimensionXValuesSet.push(dimXValue);
      //if(dimYValue){
      //  this.dimensionYValues!.push(dimYValue);
      //}

      for (let metricName in this.metricsFuncs) {
        let metricFunc = this.metricsFuncs[metricName];
        let metricValue = metricFunc(element);

        let metricValues = this.metricsValues.get(metricName) ?? new Array<Array<number>>();

      }
    });

    this.dimensionXValues = this.elements.map(v => this.dimensionXFunc(v));
    this.dimensionYValues = this.dimensionYFunc ? this.elements.map(v => this.dimensionYFunc!(v)) : undefined;

    this.indexByXDimension = new Map<number | string, number>();

    this.dimensionXValues.forEach((dimVal, idx) => {
      this.indexByXDimension.set(DataSet.makePrimitive(dimVal), idx);
    });

    this.indexByYDimension = new Map<number | string, number>();

    this.dimensionYValues?.forEach((dimVal, idx) => {
      this.indexByYDimension.set(DataSet.makePrimitive(dimVal), idx);
    });
  }

  public get is1D(): boolean {
    return this.dimensionYFunc === undefined;
  }

  public get is2D(): boolean {
    return this.dimensionYFunc !== undefined;
  }

  public getMetricValue(metricName: string, x: XDimensionType, y?: YDimensionType): number {

  }

  private static makePrimitive(value: number | string | Date): number | string {
    if (value instanceof Date) {
      return value.getTime();
    } else return value;
  }
}
