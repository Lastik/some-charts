import {EventType} from "./event-type";

export abstract class EventListener {
  action: (eventType: EventType, options?: any) => void;
  self: any;

  protected constructor(action: (eventType: EventType, options?: any) => void, self: any){
    this.action = action;
    this.self = self ?? null;
  }
}
