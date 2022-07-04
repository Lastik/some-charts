export class DataSet<TItemType,
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date> {

  public readonly elements: Array<TItemType>;

  private metricsFuncs: { [name: string]: (item: TItemType) => number };
  private dimensionXFunc: (item: TItemType) => XDimensionType;
  private dimensionYFunc?: ((item: TItemType) => YDimensionType);

  public readonly dimensionXValues: XDimensionType[];
  public readonly dimensionYValues: YDimensionType[] | undefined;



  constructor(elements: Array<TItemType>,
              metricsFuncs: {[name: string]: (item: TItemType) => number},
              dimensionXFunc: (item: TItemType) => XDimensionType,
              dimensionYFunc?: (item: TItemType) => YDimensionType,
              ) {
    this.elements = elements;
    this.metricsFuncs = metricsFuncs;
    this.dimensionXFunc = dimensionXFunc;
    this.dimensionYFunc = dimensionYFunc;

    this.dimensionXValues = this.elements.map(v => this.dimensionXFunc(v));
    this.dimensionYValues = this.dimensionYFunc ? this.elements.map(v => this.dimensionYFunc!(v)) : undefined;

    this.values = Map<>
  }

  public get is1D(): boolean {
    return this.dimensionYFunc === undefined;
  }

  public get is2D(): boolean {
    return this.dimensionYFunc !== undefined;
  }

  public get
}
