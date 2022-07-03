export class DataSet<TItemType, XDimensionType, YDimensionType> {

  public readonly elements: Array<TItemType>;

  constructor(elements: Array<TItemType>,
              dimensionX: (item: TItemType) => XDimensionType,
              dimensionY: (item: TItemType) => YDimensionType,
              ) {
    this.elements = elements;
  }
}
