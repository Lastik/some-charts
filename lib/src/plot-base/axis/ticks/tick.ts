export interface Tick<T extends object> {
  value: T;
  length: number;
  index: number;
}
