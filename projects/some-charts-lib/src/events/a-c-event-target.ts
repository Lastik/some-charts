import {EventListener} from "./event-listener";
import {EventBase} from "./event-base";
import {IDisposable} from "../i-disposable";

export class ACEventTarget<EventType extends string> implements IDisposable {

  private readonly listeners: { [EventType: string]: Array<EventListener<EventType>> };

  constructor() {
    this.listeners = {};
  }

  addListener(type: EventType, listener: EventListener<EventType>) {
    if (this.listeners[type] == undefined) {
      this.listeners[type] = [];
    }

    this.listeners[type].push(listener);
  }

  removeListener(eventType: EventType, listener: EventListener<EventType>) {
    if (this.listeners[eventType] instanceof Array) {
      let listenersOfType = this.listeners[eventType];

      let listenerIdx = listenersOfType.indexOf(listener);
      if (listenerIdx >= 0) {
        listenersOfType.splice(listenerIdx, 1);
      }
    }
  }

  dispose(): void {
    this.removeAllListeners();
  }

  removeAllListeners(){
    for (let key in this.listeners) delete this.listeners[key];
  }

  /**
   * Fires specified event.
   * @param {EventBase} event - Event to fire.
   * @param {any} options - Event parameter.
   */
  fireEvent(event: EventBase<EventType>, options?: any) {
    if (this.listeners[event.type]) {
      let listeners = this.listeners[event.type];

      for (let listener of listeners) {
        listener.eventCallback(event, options);
      }
    }
  }
}
