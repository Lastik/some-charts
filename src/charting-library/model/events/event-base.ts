export abstract class EventBase {
  public readonly type: EventType;

  protected constructor(type: EventType){
    this.type = type;
  }
}
