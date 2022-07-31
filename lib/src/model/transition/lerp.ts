export class Lerp {
  static apply(start: number, end: number, weight: number): number {
    return start * (1 - weight) + end * weight;
  }
}
