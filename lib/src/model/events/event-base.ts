import {DataSetEventType} from "../data";

export interface EventBase<EventType extends DataSetEventType> {
  readonly type: EventType;
}
