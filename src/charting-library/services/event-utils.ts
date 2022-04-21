/**
 * Contains common utility methods.
 */
import {Element} from "@angular/compiler";

export class EventUtils {

  /**
   * Stops event from bubbling.
   * @param {Event} e - Event to stop.
   */
  public static stopEvent(e: Event): void {
    /// <summary>Stops event from bubbling.</summary>
    /// <param name="e" type="Event">Event to stop.</param>
    if (!e) e = window.event!;
    if (e.stopPropagation) {
      e.stopPropagation();
    }
    if (e.cancelBubble) {
      e.cancelBubble = true;
    }
  }

  /**
   * Redirects event to element.
   * @param {MouseEvent} originalEvent - Original mouse event used to create new event.
   * @param {EventTarget} element - Event target element.
   * @param {boolean} canBubble - Indicates if event can bubble.
   */
  public static redirectMouseEventToElement(originalEvent: MouseEvent, element: EventTarget, canBubble: boolean): void {

    //TODO: support old browsers?
    let event = new MouseEvent(originalEvent.type, {
      bubbles: canBubble,
      cancelable: true,
      detail: originalEvent.detail,
      screenX: originalEvent.screenX,
      screenY: originalEvent.screenY,
      clientX: originalEvent.clientX,
      clientY: originalEvent.clientY,
      ctrlKey: originalEvent.ctrlKey,
      altKey: originalEvent.altKey,
      shiftKey: originalEvent.shiftKey,
      metaKey: originalEvent.metaKey,
      button: originalEvent.button,
      relatedTarget: null
    });

    element.dispatchEvent(event);
  }

  /**
   * Stops default event behavior.
   * @param {Event} event - Event object.
   */
  public static stopDefault(event: Event) {
    if (event.preventDefault) { event.preventDefault(); } /* Chrome, Safari, Firefox */
    event.returnValue = false; /* IE7, IE8 */
  }

  //Lowered user agent.
  Utilities.uagent = navigator.userAgent.toLowerCase();
  //True if is IE.
  Utilities.isMsIE = /MSIE (\d+\.\d+);/.test(navigator.userAgent);
  //True if is firefox
  Utilities.isFirefox = EventUtils.uagent.indexOf("firefox") > -1;
  //True if device is iphone
  Utilities.isIphone = EventUtils.uagent.indexOf("iphone") > -1;
  //True if device is ipad
  Utilities.isIpad = EventUtils.uagent.indexOf("ipad") > -1;
  //True if device is ipad
  Utilities.isIpod = EventUtils.uagent.indexOf("ipod") > -1;
  //True if device is android
  Utilities.isAndroid = EventUtils.uagent.indexOf("android") > -1;
}
