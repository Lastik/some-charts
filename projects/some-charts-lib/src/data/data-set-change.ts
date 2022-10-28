import {DimensionValue} from "./dimension-value";
import {DataSet} from "./data-set";
import {Map2D} from "./map2-d";

export abstract class DataSetChange<
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date | undefined = undefined> {
  readonly is2D: boolean;

  constructor(is2D: boolean) {
    this.is2D = is2D;

  }

  abstract isDeleted(xNumeric: number, yNumeric: number | undefined): boolean;

  abstract isUpdated(xNumeric: number, yNumeric: number | undefined): boolean;

  abstract isAdded(xNumeric: number, yNumeric: number | undefined): boolean;


  abstract getDeleted(xNumeric: number, yNumeric: number | undefined):
    DimensionValue<XDimensionType> | readonly [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>] | undefined;

  abstract getUpdated(xNumeric: number, yNumeric: number | undefined):
    DimensionValue<XDimensionType> | readonly [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>] | undefined;

  abstract getAdded(xNumeric: number, yNumeric: number | undefined):
    DimensionValue<XDimensionType> | readonly [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>] | undefined;


  static fromDataSet<XDimensionType extends number | string | Date,
    YDimensionType extends number | string | Date | undefined = undefined>(dataSet: DataSet<any, XDimensionType, YDimensionType>): DataSetChange<XDimensionType, YDimensionType> {

    if(dataSet.is1D){
      return new DataSetChange1D<XDimensionType>(
        [],
        [],
        dataSet.dimensionXValues);
    }
    else {
      return new DataSetChange2D<XDimensionType, YDimensionType>(
        [],
        [],
        dataSet.dimensionsValues as [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][]);
    }
  }

  static fromDataSetDimensionsUpdate<XDimensionType extends number | string | Date,
    YDimensionType extends number | string | Date | undefined = undefined>(
    prevDimensionsValues: DimensionValue<XDimensionType>[] | [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][],
    dimensionsValues: DimensionValue<XDimensionType>[] | [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][]):
    DataSetChange<XDimensionType, YDimensionType> {

    let id1D =
      prevDimensionsValues.length !== 0 && !Array.isArray(prevDimensionsValues[0]) ||
      dimensionsValues.length !== 0 && !Array.isArray(dimensionsValues[0]);

    if (id1D) {
      return DataSetChange1D.fromDataSetDimensionsUpdate1D(
        prevDimensionsValues as DimensionValue<XDimensionType>[],
        dimensionsValues as DimensionValue<XDimensionType>[]);
    } else {
      return DataSetChange2D.fromDataSetDimensionsUpdate2D(
        prevDimensionsValues as [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][],
        dimensionsValues as [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][]);
    }
  }
}


export class DataSetChange1D<XDimensionType extends number | string | Date> extends DataSetChange<XDimensionType>{

  readonly deleted: readonly DimensionValue<XDimensionType>[];
  readonly updated: readonly DimensionValue<XDimensionType>[];
  readonly added: readonly DimensionValue<XDimensionType>[];

  private readonly deletedMap: Map<number, DimensionValue<XDimensionType>>;
  private readonly updatedMap: Map<number, DimensionValue<XDimensionType>>;
  private readonly addedMap: Map<number, DimensionValue<XDimensionType>>;

  constructor(deleted: readonly DimensionValue<XDimensionType>[],
              updated: readonly DimensionValue<XDimensionType>[],
              added: readonly DimensionValue<XDimensionType>[]) {

    super(false)

    this.deleted = deleted;
    this.updated = updated;
    this.added = added;

    this.deletedMap = new Map((deleted as DimensionValue<XDimensionType>[]).map(v => [v.toNumericValue(), v]));
    this.updatedMap = new Map((updated as DimensionValue<XDimensionType>[]).map(v => [v.toNumericValue(), v]));
    this.addedMap = new Map((added as DimensionValue<XDimensionType>[]).map(v => [v.toNumericValue(), v]));
  }

  isDeleted(xNumeric: number) {
    return this.deletedMap.has(xNumeric);
  }

  isUpdated(xNumeric: number) {
    return this.updatedMap.has(xNumeric);
  }

  isAdded(xNumeric: number) {
    return this.addedMap.has(xNumeric);
  }

  getDeleted(xNumeric: number): DimensionValue<XDimensionType> | undefined {
    return this.deletedMap.get(xNumeric);
  }

  getUpdated(xNumeric: number): DimensionValue<XDimensionType> | undefined{
    return this.updatedMap.get(xNumeric);
  }

  getAdded(xNumeric: number): DimensionValue<XDimensionType> | undefined{
    return this.addedMap.get(xNumeric);
  }

  public static fromDataSetDimensionsUpdate1D<XDimensionType extends number | string | Date,
    YDimensionType extends number | string | Date | undefined = undefined>(
    prevDimensionValues: DimensionValue<XDimensionType>[],
    dimensionValues: DimensionValue<XDimensionType>[]):
    DataSetChange<XDimensionType, YDimensionType> {

    let deleted: DimensionValue<XDimensionType>[] = [];
    let updated: DimensionValue<XDimensionType>[] = [];
    let added: DimensionValue<XDimensionType>[] = [];

    let prevDimensionValuesMap = new Map(prevDimensionValues.map(v => ([v.toNumericValue(), v])));
    let dimensionValuesMap = new Map(dimensionValues.map(v => ([v.toNumericValue(), v])));

    for (let prevDimVal of prevDimensionValues) {
      if (dimensionValuesMap.has(prevDimVal.toNumericValue())) {
        updated.push(dimensionValuesMap.get(prevDimVal.toNumericValue())!);
      } else {
        deleted.push(prevDimVal)
      }
    }

    for (let dimVal of dimensionValues) {
      if (!prevDimensionValuesMap.has(dimVal.toNumericValue())) {
        added.push(dimVal);
      }
    }

    return new DataSetChange1D<XDimensionType>(deleted, updated, added);
  }
}

export class DataSetChange2D<
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date | undefined> extends DataSetChange<XDimensionType, YDimensionType>{

  readonly deleted: readonly [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][];
  readonly updated: readonly [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][];
  readonly added: readonly [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][];

  private readonly deletedMap: Map2D<XDimensionType, Exclude<YDimensionType, undefined>, [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>]>;
  private readonly updatedMap: Map2D<XDimensionType, Exclude<YDimensionType, undefined>, [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>]>;
  private readonly addedMap: Map2D<XDimensionType, Exclude<YDimensionType, undefined>, [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>]>;

  constructor(deleted: readonly [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][],
              updated: readonly [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][],
              added: readonly [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][]) {

    super(true)

    this.deleted = deleted;
    this.updated = updated;
    this.added = added;

    this.deletedMap = this.buildMap(deleted);
    this.updatedMap = this.buildMap(updated);
    this.addedMap = this.buildMap(added);
  }

  protected buildMap(xy: readonly [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][]) {
    return new Map2D<XDimensionType, Exclude<YDimensionType, undefined>, [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>]>(
      xy,
      v => v[0].toNumericValue(),
      v => v[1].toNumericValue()
    );
  }

  isDeleted(xNumeric: number, yNumeric: number) {
    return this.deletedMap.hasNumeric(xNumeric, yNumeric);
  }

  isUpdated(xNumeric: number, yNumeric: number) {
    return this.updatedMap.hasNumeric(xNumeric, yNumeric);
  }

  isAdded(xNumeric: number, yNumeric: number) {
    return this.addedMap.hasNumeric(xNumeric, yNumeric);
  }

  getDeleted(xNumeric: number, yNumeric: number): readonly [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>] | undefined {
    return this.deletedMap.getNumeric(xNumeric, yNumeric);
  }

  getUpdated(xNumeric: number, yNumeric: number): readonly [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>] | undefined {
    return this.updatedMap.getNumeric(xNumeric, yNumeric);
  }

  getAdded(xNumeric: number, yNumeric: number): readonly [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>] | undefined {
    return this.addedMap.getNumeric(xNumeric, yNumeric);
  }

  protected isInMap(
    map: Map2D<XDimensionType, Exclude<YDimensionType, undefined>, [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>]>,
    xNumeric: number, yNumeric: number) {
    return map.hasNumeric(xNumeric, yNumeric);
  }

  public static fromDataSetDimensionsUpdate2D<XDimensionType extends number | string | Date,
    YDimensionType extends number | string | Date | undefined>(
    prevDimensionsValues: [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][],
    dimensionsValues: [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][]):
    DataSetChange<XDimensionType, YDimensionType> {

    let deleted: [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][] = [];
    let updated: [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][] = [];
    let added: [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>][] = [];

    let prevDimensionsValueMap = new Map2D(prevDimensionsValues,
      v => v[0].toNumericValue(),
      v => v[1].toNumericValue());
    let dimensionsValuesMap = new Map2D(dimensionsValues,
      v => v[0].toNumericValue(),
      v => v[1].toNumericValue());

    for (let prevDimsVal of prevDimensionsValues) {
      if (dimensionsValuesMap.has(prevDimsVal[0], prevDimsVal[1])) {
        updated.push(dimensionsValuesMap.get(prevDimsVal[0], prevDimsVal[1])!);
      } else {
        deleted.push(prevDimsVal)
      }
    }

    for (let dimVal of dimensionsValues) {
      if (!prevDimensionsValueMap.has(dimVal[0], dimVal[1])) {
        added.push(dimVal);
      }
    }

    return new DataSetChange2D<XDimensionType, YDimensionType>(deleted, updated, added);
  }
}
