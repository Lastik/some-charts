export class Margin {
  constructor(
    public readonly top: number,
    public readonly right: number,
    public readonly bottom: number,
    public readonly left: number) { }

  public merge(other: Margin): Margin {
    return new Margin(
      Math.max(this.top, other.top),
      Math.max(this.right, other.right),
      Math.max(this.bottom, other.bottom),
      Math.max(this.left, other.left));
  }
}

