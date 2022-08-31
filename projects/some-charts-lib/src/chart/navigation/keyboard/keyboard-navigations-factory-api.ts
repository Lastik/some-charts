export interface KeyboardNavigationsFactoryApi<KeyboardNavigationType> {
  create(): KeyboardNavigationType;
  removeReference(navigation: KeyboardNavigationType): void;
  removeReferenceById(id: number): void;
  getAllNavigations(): IterableIterator<KeyboardNavigationType>;
}
