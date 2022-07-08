import {DataSetEventType} from "../../core/data";

export interface EventBase<EventType extends DataSetEventType> {
  readonly type: EventType;
}
