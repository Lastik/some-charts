import {DimensionValue} from "./dimension-value";
import {DataSet} from "./data-set";
import {ArrayHelper} from "../services";

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

  static fromDataSetDimensionsUpdate<XDimensionType extends number | string | Date,
    YDimensionType extends number | string | Date | undefined = undefined>(
      prevDimensionsValues: DimensionValue<XDimensionType>[] | [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][],
      dimensionsValues: DimensionValue<XDimensionType>[] | [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][]):
    DataSetChange<XDimensionType, YDimensionType> {

    let id1D = Array.isArray(
      prevDimensionsValues.length !== 0 && !Array.isArray(prevDimensionsValues[0]) ||
      dimensionsValues.length !== 0 && !Array.isArray(dimensionsValues[0]));

    if (id1D) {
      return DataSetChange.fromDataSetDimensionsUpdate1D(
        prevDimensionsValues as DimensionValue<XDimensionType>[],
        dimensionsValues as DimensionValue<XDimensionType>[]);
    }
    return DataSetChange.fromDataSetDimensionsUpdate2D(
      prevDimensionsValues as [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][],
      dimensionsValues as [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][]);
  }

  private static fromDataSetDimensionsUpdate1D<
    XDimensionType extends number | string | Date,
    YDimensionType extends number | string | Date | undefined = undefined>(
      prevDimensionValues: DimensionValue<XDimensionType>[],
      dimensionValues: DimensionValue<XDimensionType>[]):
    DataSetChange<XDimensionType, YDimensionType> {

    let deleted: DimensionValue<XDimensionType>[] = [];
    let updated: DimensionValue<XDimensionType>[] = [];
    let added: DimensionValue<XDimensionType>[] = [];

    let prevDimensionValuesMap = new Map(prevDimensionValues.map(v => ([v.primitiveValue, v])));
    let dimensionValuesMap = new Map(dimensionValues.map(v => ([v.primitiveValue, v])));

    for(let prevDimVal of prevDimensionValues) {
      if (dimensionValuesMap.has(prevDimVal.primitiveValue)) {
        updated.push(dimensionValuesMap.get(prevDimVal.primitiveValue)!);
      } else {
        deleted.push(prevDimVal)
      }
    }

    for(let dimVal of dimensionValues){
      if(!prevDimensionValuesMap.has(dimVal.primitiveValue)){
        added.push(dimVal);
      }
    }

    return new DataSetChange<XDimensionType, YDimensionType>(deleted, updated, added);
  }

  private static fromDataSetDimensionsUpdate2D<
    XDimensionType extends number | string | Date,
    YDimensionType extends number | string | Date | undefined = undefined>(
      prevDimensionsValues: [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][],
      dimensionsValues: [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][]):
    DataSetChange<XDimensionType, YDimensionType>{

    let deleted: [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][] = [];
    let updated: [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][] = [];
    let added: [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][] = [];

    let prevDimensionsValuesMap: Map<number | string, Array<[DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>]>> = ArrayHelper.groupByMap(prevDimensionsValues, v=> v[0].primitiveValue);
    let prevDimensionsValuesMapOfMap: Map<number | string,  Map<number | string, [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>]>> = new Map();

    for(let x of prevDimensionsValuesMap.keys()) {
      let prevDimensionsValuesForX = prevDimensionsValuesMap.get(x)!;
      prevDimensionsValuesMapOfMap.set(x, new Map(prevDimensionsValuesForX.map(v => [v[1].primitiveValue, v])));
    }

    let dimensionsValuesMap =  ArrayHelper.groupByMap(dimensionsValues, v=> v[0].primitiveValue);
    let dimensionsValuesMapOfMap: Map<number | string,  Map<number | string, [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>]>> = new Map();

    for(let x of dimensionsValuesMap.keys()) {
      let dimensionsValuesForX = dimensionsValuesMap.get(x)!;
      dimensionsValuesMapOfMap.set(x, new Map(dimensionsValuesForX.map(v => [v[1].primitiveValue, v])));
    }

    for(let prevDimsVal of prevDimensionsValues) {
      if (dimensionsValuesMapOfMap.has(prevDimsVal[0].primitiveValue)) {
        let dimensionsValuesMapForXMap = dimensionsValuesMapOfMap.get(prevDimsVal[0].primitiveValue)!;

        if (dimensionsValuesMapForXMap.has(prevDimsVal[1].primitiveValue)) {
          updated.push(dimensionsValuesMapForXMap.get(prevDimsVal[1].primitiveValue)!);
        } else {
          deleted.push(prevDimsVal)
        }
      } else {
        deleted.push(prevDimsVal)
      }
    }

    for(let dimVal of dimensionsValues) {
      if (!prevDimensionsValuesMapOfMap.has(dimVal[0].primitiveValue)) {
        added.push(dimVal);
      } else {
        let prevDimensionsValuesMapForXMap = prevDimensionsValuesMapOfMap.get(dimVal[0].primitiveValue)!;
        if (!prevDimensionsValuesMapForXMap.has(dimVal[1].primitiveValue)) {
          added.push(dimVal);
        }
      }
    }

    return new DataSetChange<XDimensionType, YDimensionType>(deleted, updated, added);

  }
}
