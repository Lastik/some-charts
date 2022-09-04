import {KeyboardNavigation} from "./keyboard-navigation";

export class KeyboardNavigationsFactory {

  private currentId: number = 1;
  private navigationsById: Map<number, KeyboardNavigation>;

  private constructor() {
    this.navigationsById = new Map<number, KeyboardNavigation>();
  }

  public create(): KeyboardNavigation {
    let id = this.getNextId();
    let newNavigation = new KeyboardNavigation(id);
    this.navigationsById.set(id, new KeyboardNavigation(id));
    return newNavigation;
  }

  public removeReference(navigation: KeyboardNavigation) {
    this.removeReferenceById(navigation.id)
  }

  public removeReferenceById(id: number) {
    this.navigationsById.delete(id);
  }

  public getAllNavigations(): IterableIterator<KeyboardNavigation>{
    return this.navigationsById.values();
  }

  private getNextId(): number {
    return this.currentId++;
  }

  public static readonly Instance = new KeyboardNavigationsFactory();
}
