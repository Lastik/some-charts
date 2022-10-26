
export class ArrayHelper {

  public static groupByMap<ElementType, KeyType>(collection: Array<ElementType>, iteratee: ((_: ElementType) => KeyType)): Map<KeyType, Array<ElementType>> {

    let grouped = new Map<KeyType, Array<ElementType>>();

    for (let entity of collection) {
      const key = iteratee(entity);

      if (grouped.has(key)) {
        grouped.get(key)!.push(entity);
      } else {
        grouped.set(key, [entity]);
      }
    }

    return grouped;
  }
}