import {Point, Sorting} from "../index";

export class DimensionValue<XDimensionType extends number | string | Date> {
  public readonly value: XDimensionType;
  public readonly primitiveValue: number | string;
  public readonly index: number;

  constructor(value: XDimensionType, index: number = -1) {
    this.value = value;
    this.primitiveValue = DimensionValue.makePrimitive(this.value);
    this.index = index;
  }

  private static makePrimitive(value: number | string | Date): number | string {
    if (value instanceof Date) {
      return value.getTime();
    } else return value;
  }

  public withIndex(index: number): DimensionValue<XDimensionType> {
    return new DimensionValue<XDimensionType>(this.value, index);
  }

  public static getCompareFunc<XDimensionType extends number | string | Date>(sorting: Sorting = Sorting.Asc) {
    return function (left: DimensionValue<XDimensionType>, right: DimensionValue<XDimensionType>) {
      let leftPrimitive = left.primitiveValue;
      let rightPrimitive = right.primitiveValue;

      if (sorting === Sorting.None) {
        return -1;
      } else {
        if (leftPrimitive > rightPrimitive) {
          return sorting === Sorting.Asc ? 1 : -1;
        } else if (leftPrimitive < rightPrimitive) {
          return sorting === Sorting.Asc ? -1 : 1;
        } else return 0;
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
