export class DimensionValue<XDimensionType extends number | string | Date> {
  public readonly value: XDimensionType;
  public readonly primitiveValue: number | string;

  constructor(value: XDimensionType) {
    this.value = value;
    this.primitiveValue = DimensionValue.makePrimitive(this.value);
  }

  private static makePrimitive(value: number | string | Date): number | string {
    if (value instanceof Date) {
      return value.getTime();
    } else return value;
  }

  public static compareFunc<XDimensionType extends number | string | Date>(left: DimensionValue<XDimensionType>, right: DimensionValue<XDimensionType>){
    let leftPrimitive = left.primitiveValue;
    let rightPrimitive = right.primitiveValue;

    if(leftPrimitive > rightPrimitive){
      return 1;
    }
    else if (leftPrimitive < rightPrimitive){
      return - 1;
    }
    else return 0;
  }
}
