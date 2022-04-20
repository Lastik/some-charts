/**
 * Contains common utility methods.
 */
import {Element} from "@angular/compiler";

export class Utilities {

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

  /// <summary>Fires event on element.</summary>
  /// <param name="element">Element.</param>
  /// <param name="eventType" type="String">Type of event to fire.</param>
  /// <param name="e">Event arguments.</param>
  /// <param name="bubble" type="Boolen">To bubble or not to bubble event.</param>


  /**
   * Redirects event to element.
   * @param {MouseEvent} originalEvent - Original mouse event used to create new event.
   * @param {EventTarget} element - Event target element.
   * @param {boolean} canBubble - Indicates if event can bubble.
   */
  public static redirectMouseEventToElement(originalEvent: MouseEvent, element: EventTarget, canBubble: boolean): void {

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

  Utilities.stopDefault = function (e) {
    /// <summary>Stops default event behavior.</summary>
    /// <param name="e" type="Event"> Default event behavior.</param>
    if (!e){ e = window.event; } /* IE7, IE8, Chrome, Safari */
    if (e.preventDefault) { e.preventDefault(); } /* Chrome, Safari, Firefox */
    e.returnValue = false; /* IE7, IE8 */
  }

  //Vertical multiplier, which must be used for offetting fillText canvas method.
  //Each text must be offseted my this constant to top direction (-y axis).

  Utilities.TextVerticalOffsetMultiplier = 0.17;

  Utilities.parseDate = function (input, format) {
    /// <summary>Parses date with specified format.</summary>
    /// <param name="input" type="String">Date to parse.</param>
    /// <param name="format" type="String">Date format.</param>
    format = format || 'yyyy-MM-dd'; // default format
    var parts = input.match(/(\d+)/g),
      i = 0, fmt = {};
    // extract date-part indexes from the format
    format.replace(/(yyyy|dd|MM|hh|mm|ss)/g, function (part) { fmt[part] = i++; });

    return new Date(parts[fmt['yyyy']], parts[fmt['MM']] - 1, parts[fmt['dd']], parts[fmt['hh']], parts[fmt['mm']], parts[fmt['ss']]);
  };

  //Lowered user agent.
  Utilities.uagent = navigator.userAgent.toLowerCase();
  //True if is IE.
  Utilities.isMsIE = /MSIE (\d+\.\d+);/.test(navigator.userAgent);
  //True if is firefox
  Utilities.isFirefox = Utilities.uagent.indexOf("firefox") > -1;
  //True if device is iphone
  Utilities.isIphone = Utilities.uagent.indexOf("iphone") > -1;
  //True if device is ipad
  Utilities.isIpad = Utilities.uagent.indexOf("ipad") > -1;
  //True if device is ipad
  Utilities.isIpod = Utilities.uagent.indexOf("ipod") > -1;
  //True if device is android
  Utilities.isAndroid = Utilities.uagent.indexOf("android") > -1;
}
