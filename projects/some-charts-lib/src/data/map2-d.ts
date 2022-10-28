import {DimensionValue} from "./dimension-value";
import {ArrayHelper} from "../services";

export class Map2D<
  XDimensionType extends number | string | Date,
  YDimensionType extends number | string | Date,
  ValueType> {
  private mapByXbyY: Map<number, Map<number, ValueType>>;

  constructor(xy: readonly ValueType[], xExtractor: (v: ValueType) => number, yExtractor: (v: ValueType) => number) {
    this.mapByXbyY = new Map<number, Map<number, ValueType>>();

    let mapByX = ArrayHelper.groupByMap(xy, v => xExtractor(v));
    let mapByXbyY: Map<number, Map<number, ValueType>> = new Map();

    for (let x of mapByX.keys()) {
      let letValuesForX = mapByX.get(x)!;
      mapByXbyY.set(x, new Map(letValuesForX.map(v => [yExtractor(v), v])));
    }

    this.mapByXbyY = mapByXbyY;
  }

  public has(x: DimensionValue<XDimensionType>, y: DimensionValue<YDimensionType>) {
    return this.hasNumeric(x.toNumericValue(), y.toNumericValue());
  }

  public hasNumeric(x: number, y: number) {
    return this.mapByXbyY.has(x) && this.mapByXbyY.get(x)!.has(y);
  }

  public get(x: DimensionValue<XDimensionType>, y: DimensionValue<YDimensionType>): ValueType | undefined {
    return this.getNumeric(x.toNumericValue(), y.toNumericValue());
  }

  public getNumeric(x: number, y: number): ValueType | undefined {
    if (this.mapByXbyY.has(x)) {
      let map = this.mapByXbyY.get(x)!;
      return map.get(y)
    } else return undefined;
  }
}
