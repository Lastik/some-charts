import {EventListener} from "./event-listener";
import {EventBase} from "./event-base";
import {EventType} from "./event-type";

export class ACEventTarget {

  private readonly listeners: { [EventType: string]: Array<EventListener> };

  constructor() {
    this.listeners = {};
  }

  addListener(type: EventType, listener: EventListener) {
    if (this.listeners[type] == undefined) {
      this.listeners[type] = [];
    }

    this.listeners[type].push(listener);
  }

  removeListener(eventType: EventType, listener: EventListener) {
    if (this.listeners[eventType] instanceof Array) {
      let listenersOfType = this.listeners[eventType];

      let listenerIdx = listenersOfType.indexOf(listener);
      if (listenerIdx >= 0) {
        listenersOfType.splice(listenerIdx, 1);
      }
    }
  }

  /**
   * Fires event of specified type.
   * @param {EventType} eventType - Type of event to fire.
   * @param {any} options - Event parameter.
   */
  fireEventOfType(eventType: EventType, options?: any) {
    this.fireEvent({type: eventType}, options);
  }

  /**
   * Fires specified event.
   * @param {EventBase} event - Event to fire.
   * @param {any} options - Event parameter.
   */
  fireEvent(event: EventBase, options?: any) {
    if (this.listeners[event.type]) {
      let listeners = this.listeners[event.type];

      for (let listener of listeners) {
        listener.action.call(listener.self, event.type, options);
      }
    }
  }
}
