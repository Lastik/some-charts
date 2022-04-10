(function (window) {

    var Utilities = function () {
        /// <summary>Contains common utility methods.</summary>
    }

    Utilities.stopEvent = function (e) {
    /// <summary>Stops event from bubbling.</summary>
    /// <param name="e" type="Event">Event to stop.</param>
        if (!e) e = window.event;
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        if (e.cancelBubble) {
            e.cancelBubble = true;
        }
    }

    Utilities.fireEvent = function (elementID, eventName, bubble, e) {
        /// <summary>Fires event on element with specified elementID.</summary>
        /// <param name="elementID" type="Integer">Element ID.</param>
        /// <param name="eventName" type="String">Name of event to fire.</param>
        /// <param name="e">Event arguments.</param>
        /// <param name="bubble" type="Boolen">To bubble or not to bubble event.</param>
        var element = document.getElementById(elementID);
        Utilities.fireEventToElement(element, eventName, bubble, e);
    }

    Utilities.fireEventToElement = function (element, eventName, bubble, e) {
        /// <summary>Fires event on element.</summary>
        /// <param name="element">Element.</param>
        /// <param name="eventName" type="String">Name of event to fire.</param>
        /// <param name="e">Event arguments.</param>
        /// <param name="bubble" type="Boolen">To bubble or not to bubble event.</param>
        if (document.createEvent) {
            var evObj = document.createEvent('MouseEvents');
            evObj.initMouseEvent(eventName, bubble, true, window, e.detail, e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.button, null);
            element.dispatchEvent(evObj);
        } else if (document.createEventObject) {
            var evObj = document.createEventObject();
            evObj.detail = 0;
            evObj.screenX = 12;
            evObj.screenY = 345;
            evObj.clientX = 7;
            evObj.clientY = 220;
            evObj.ctrlKey = false;
            evObj.altKey = false;
            evObj.shiftKey = true;
            evObj.metaKey = false;
            evObj.button = 0;
            evObj.relatedTarget = null;
            element.fireEvent(eventName, evObj);
        }
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

    String.prototype.format = function () {
    /// <summary>Fills this format string with specified arguments.</summary>
        var formatted = this;
        for (var i = 0; i < arguments.length; i++) {
            var regexp = new RegExp('\\{' + i + '\\}', 'gi');
            formatted = formatted.replace(regexp, arguments[i]);
        }
        return formatted;
    };

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

    window.Utilities = Utilities;

}(window));