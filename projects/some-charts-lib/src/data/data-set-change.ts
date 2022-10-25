import {DimensionValue} from "./dimension-value";
import {DataSet} from "./data-set";

export class DataSetChange<XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined> {

  readonly deleted: readonly DimensionValue<XDimensionType>[] | readonly [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][];
  readonly updated: readonly DimensionValue<XDimensionType>[] | readonly [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][];
  readonly added: readonly DimensionValue<XDimensionType>[] | readonly [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][];

  constructor(deleted: readonly DimensionValue<XDimensionType>[] | readonly [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][],
              updated: readonly DimensionValue<XDimensionType>[] | readonly [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][],
              added: readonly DimensionValue<XDimensionType>[] | readonly [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][]) {
    this.deleted = deleted;
    this.updated = updated;
    this.added = added;
  }

  static fromDataSet<XDimensionType extends number | string | Date,
    YDimensionType extends number | string | Date | undefined = undefined>(dataSet: DataSet<any, XDimensionType, YDimensionType>): DataSetChange<XDimensionType, YDimensionType> {
    return new DataSetChange<XDimensionType, YDimensionType>(
      [],
      [],
      dataSet.dimensionXValues
    )
  }
}
