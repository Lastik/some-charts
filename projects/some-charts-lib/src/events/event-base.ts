export interface EventBase<EventType extends string> {
  readonly type: EventType;
}
