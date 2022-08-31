import { singleton } from "tsyringe";
import {KeyboardNavigation} from "./keyboard-navigation";
import {KeyboardNavigationsFactoryApi} from "./keyboard-navigations-factory-api";

@singleton()
export class KeyboardNavigationsFactory implements KeyboardNavigationsFactoryApi<KeyboardNavigation>{

  private currentId: number = 1;
  private navigationsById: Map<number, KeyboardNavigation>;

  constructor() {
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
}
