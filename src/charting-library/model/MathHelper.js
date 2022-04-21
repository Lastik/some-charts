/// <reference path="point.js" />

import {UagentUtils} from "../services/uagent-utils";

(function (window) {

    var MathHelper = function () {
    /// <summary>Helps to perform mathematical operations with values.</summary>
    }

    MathHelper.optimizePoint = function (point) {
        /// <summary>Optimizes point's coordinates for better performance.</summary>
        /// <param name="point" type="Point">Point to optimize.</param>
        /// <returns type="Point" />
        if (UagentUtils.isMsIE) {
            return new NumericPoint(
            MathHelper.optimizeValue(point.x),
            MathHelper.optimizeValue(point.y));
        }
        else {
            return point;
        }
    }

    MathHelper.optimizeValue = function (value) {
        /// <summary>Optimizes single value for better performance.</summary>
        /// <param name="value" type="Number">Value to optimize.</param>
        /// <returns type="Number" />
        if (UagentUtils.isMsIE) {
            return MathHelper.truncateValue(value);
        }
        else {
            return value;
        }
    }

    MathHelper.truncateValue = function (value) {
        /// <summary>Truncates value's floating part.</summary>
        /// <param name="value" type="Number">Value to truncate.</param>
        /// <returns type="Number" />
        return (value + .5) | 0
    }

    MathHelper.calculateTextVerticalOffsetHeight = function (context, font) {
        /// <summary>Calculates offset for specified font.</summary>
        /// <param name="context" type="Context">Render context.</param>
        /// <param name="font" type="String">Font.</param>
        context.font = font;
        return context.measureText("m").width * 0.225;
    }

    MathHelper.calculateTextHeight = function (context, font) {
        /// <summary>Calculates text height for specifie font.</summary>
        /// <param name="context" type="Context">Render context.</param>
        /// <param name="font" type="String">Font.</param>
        context.font = font;
        return context.measureText("m").width * 1.05;
    }

    window.MathHelper = MathHelper;

}(window));
