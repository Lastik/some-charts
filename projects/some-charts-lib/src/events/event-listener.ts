import {EventBase} from "./event-base";

export interface EventListener<EventType extends string> {
  eventCallback(event: EventBase<EventType>, options?: any): void;
}
