import {DimensionValue} from "./dimension-value";
import {DataSet} from "./data-set";

export class DataSetChange<XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined> {

  readonly deletedDimensionXValues: readonly DimensionValue<XDimensionType>[];
  readonly deletedDimensionYValues: readonly DimensionValue<Exclude<YDimensionType, undefined>>[] | undefined;

  readonly updatedDimensionXValues: readonly DimensionValue<XDimensionType>[];
  readonly updatedDimensionYValues: readonly DimensionValue<Exclude<YDimensionType, undefined>>[] | undefined;

  readonly addedDimensionXValues: readonly DimensionValue<XDimensionType>[];
  readonly addedDimensionYValues: readonly DimensionValue<Exclude<YDimensionType, undefined>>[] | undefined;

  constructor(deletedDimensionXValues: readonly DimensionValue<XDimensionType>[],
              deletedDimensionYValues: readonly DimensionValue<Exclude<YDimensionType, undefined>>[] | undefined,
              updatedDimensionXValues: readonly DimensionValue<XDimensionType>[],
              updatedDimensionYValues: readonly DimensionValue<Exclude<YDimensionType, undefined>>[] | undefined,
              addedDimensionXValues: readonly DimensionValue<XDimensionType>[],
              addedDimensionYValues: readonly DimensionValue<Exclude<YDimensionType, undefined>>[] | undefined) {
    this.deletedDimensionXValues = deletedDimensionXValues;
    this.deletedDimensionYValues = deletedDimensionYValues;
    this.updatedDimensionXValues = updatedDimensionXValues;
    this.updatedDimensionYValues = updatedDimensionYValues;
    this.addedDimensionXValues = addedDimensionXValues;
    this.addedDimensionYValues = addedDimensionYValues;
  }

  static fromDataSet<XDimensionType extends number | string | Date,
    YDimensionType extends number | string | Date | undefined = undefined>(dataSet: DataSet<any, XDimensionType, YDimensionType>): DataSetChange<XDimensionType, YDimensionType> {
    return new DataSetChange<XDimensionType, YDimensionType>(
      [],
      [],
      [],
      [],
      dataSet.dimensionXValues,
      dataSet.dimensionYValues
    )
  }
}
