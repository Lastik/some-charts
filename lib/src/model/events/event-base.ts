import {EventType} from "./event-type";

export interface EventBase {
  readonly type: EventType;
}
