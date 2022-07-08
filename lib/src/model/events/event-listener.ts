import {DataSetEventType} from "../../core/data";
import {EventBase} from "./event-base";

export interface EventListener<EventType extends DataSetEventType> {
  eventCallback(event: EventBase<EventType>, options?: any): void;
}
