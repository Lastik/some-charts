import { singleton } from "tsyringe";
import {KeyboardNavigation} from "./keyboard-navigation";

@singleton()
export class KeyboardNavigationsFactory {

  private currentId: number = 1;
  private navigationsById: Map<number, KeyboardNavigation>;

  constructor() {
    this.navigationsById = new Map<number, KeyboardNavigation>();
  }

  public create(navigation: KeyboardNavigation) {
    let id = this.getNextId();
    this.navigationsById.set(id, new KeyboardNavigation(id));
  }

  public removeReference(navigation: KeyboardNavigation) {
    this.removeReferenceById(navigation.id)
  }

  public removeReferenceById(id: number) {
    this.navigationsById.delete(id);
  }

  private getNextId(): number {
    return this.currentId++;
  }
}
