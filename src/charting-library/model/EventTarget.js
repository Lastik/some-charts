(function (window) {

    function EventTarget() {
        this._listeners = {};
        this._states = {};
    }

    EventTarget.prototype = {

        _listeners: Array,
        _states: Array,

        constructor: EventTarget,

        addListener: function (type, listener, state) {
            if (typeof this._listeners[type] == "undefined") {
                this._listeners[type] = [];
            }

            if (typeof this._states[type] == "undefined") {
                this._states[type] = [];
            }

            if (typeof state == "undefined") {
                state = null;
            }

            this._listeners[type].push(listener);
            this._states[type].push(state);
        },

        fire: function (event, param) {
            /// <summary>Fires event with specified name.</summary>
            /// <param name="event" type="String">Name of event to fire.</param>
            /// <param name="param" optional="true">Event parameter.</param>
            if (typeof event == "string") {
                event = { type: event };
            }
            if (!event.target) {
                event.target = this;
            }

            if (!event.type) {  //falsy
                throw new Error("Event object missing 'type' property.");
            }

            if (this._listeners[event.type]instanceof Array) {
                var listeners = this._listeners[event.type];
                var states = this._states[event.type];
                for (var i = 0, len = listeners.length; i < len; i++) {
                    listeners[i].call(this, event, states[i], param);
                }
            }
        },

        removeListener: function (type, listener) {
            if (this._listeners[type]instanceof Array) {
                var listeners = this._listeners[type];
                var states = this._states[type];
                for (var i = 0, len = listeners.length; i < len; i++) {
                    if (listeners[i] == listener) {
                        listeners.splice(i, 1);
                        states.splice(i, 1);
                        break;
                    }
                }
            }
        }
    };

    window.EventTarget = EventTarget;
}(window));