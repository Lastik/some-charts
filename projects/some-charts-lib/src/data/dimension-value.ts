import {Point} from "../geometry";
import {Sorting} from "../sorting";

export class DimensionValue<XDimensionType extends number | string | Date> {
  public readonly value: XDimensionType;
  public readonly primitiveValue: number | string;
  public readonly index: number;

  constructor(value: XDimensionType, index: number = -1) {
    this.value = value;
    this.primitiveValue = DimensionValue.makePrimitive(this.value);
    this.index = index;
  }

  public static makePrimitive(value: number | string | Date): number | string {
    if (value instanceof Date) {
      return value.getTime();
    } else return value;
  }

  public static buildForDateFromPrimitive(primitiveValue: number ): DimensionValue<Date> {
    return new DimensionValue<Date>(new Date(primitiveValue));
  }

  public withIndex(index: number): DimensionValue<XDimensionType> {
    return new DimensionValue<XDimensionType>(this.value, index);
  }

  public static getCompareFunc<XDimensionType extends number | string | Date>(sorting: Sorting = Sorting.Asc) {
    return function (left: DimensionValue<XDimensionType>, right: DimensionValue<XDimensionType>) {
      let leftPrimitive = left.primitiveValue;
      let rightPrimitive = right.primitiveValue;

      if (sorting === Sorting.None) {
        return 1;
      } else {
        if (leftPrimitive > rightPrimitive) {
          return sorting === Sorting.Asc ? 1 : -1;
        } else if (leftPrimitive < rightPrimitive) {
          return sorting === Sorting.Asc ? -1 : 1;
        } else return 0;
      }
    }
  }

  public static getCompareFunc2D<
    XDimensionType extends number | string | Date,
    YDimensionType extends number | string | Date>(sorting: Sorting = Sorting.Asc) {
    return function (left: [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>],
                     right: [DimensionValue<XDimensionType>, DimensionValue<Exclude<YDimensionType, undefined>>]) {
      let leftXPrimitive = left[0].primitiveValue;
      let leftYPrimitive = left[1].primitiveValue;

      let rightXPrimitive = right[0].primitiveValue;
      let rightYPrimitive = right[0].primitiveValue;

      if (sorting === Sorting.None) {
        return -1;
      } else {
        if (leftXPrimitive > rightXPrimitive) {
          return sorting === Sorting.Asc ? 1 : -1;
        } else if (leftXPrimitive < rightXPrimitive) {
          return sorting === Sorting.Asc ? -1 : 1;
        } else {
          if (leftYPrimitive > rightYPrimitive) {
            return sorting === Sorting.Asc ? 1 : -1;
          } else if (leftYPrimitive < rightYPrimitive) {
            return sorting === Sorting.Asc ? -1 : 1;
          } else return 0;
        }
      }
    }
  }

  public toPoint(): Point<number | string> {
    return new Point<number | string>(this.primitiveValue, this.index)
  }

  /**
   * Converts dimension value to its numeric representation.
   * @returns {number} - For numbers, it returns the number. Otherwise, it will return index.
   */
  public toNumericValue(): number {
    if (typeof this.primitiveValue === 'string') {
      return this.index;
    } else return this.primitiveValue
  }
}
