
import {NumericPoint} from "../../model/point/numeric-point";
import {Range} from "../../model/range";
import {Size} from "../../model/size";
import {AxisOptions, AxisOptionsDefaults} from "../../options/axis-options";
import Konva from "konva";
import {MathHelper} from "../../services/math-helper";
import {Renderer} from "../../core/renderer";
import {ChartRenderableItem} from "../../core/chart-renderable-item";
import {Chart} from "../chart";

export abstract class AxisBase extends ChartRenderableItem {
  /**
   * Vertical multiplier, which must be used for defining an offset for fillText canvas method.
   * Each text must be shifted by this constant in top direction (Y axis).
   */
  public static readonly textVerticalOffsetMultiplier: number = 0.17;

  private location: NumericPoint;
  private range: Range;
  private size: Size | null;
  private orientation: AxisOrientation;
  private options: AxisOptions;

  private border: Konva.Shape;
  private layer?: Konva.Layer;

  public constructor(location: NumericPoint,
                     range: Range,
                     size: Size,
                     orientation: AxisOrientation,
                     options?: AxisOptions) {
    super();

    this.location = location;
    this.range = range;
    this.size = size;

    this.markDirty();
    this.orientation = orientation;

    this.options = options ?? AxisOptionsDefaults.Instance;

    let axis = this;

    this.border = new Konva.Shape({
      fill: this.options.backgroundColor,
      stroke: this.options.foregroundColor,
      strokeWidth: 1,
      sceneFunc: function (context, shape) {
        let location = axis.location;
        let size = axis.size;

        let roundedX = MathHelper.optimizeValue(location.x);
        let roundedY = MathHelper.optimizeValue(location.y);

        let roundedWidth = MathHelper.optimizeValue(size!.width);
        let roundedHeight = MathHelper.optimizeValue(size!.height);
        if (axis.options.drawBorder) {
          context.strokeRect(roundedX, roundedY, roundedWidth, roundedHeight);
        }
        context.fillRect(roundedX, roundedY, roundedWidth, roundedHeight);
      }
    });
  }

  protected abstract get axisShape(): Konva.Shape;

  override getDependantLayers(): Array<string> {
    return ["visibleObjects"];
  }

  override placeOnChart(chart?: Chart) {
    super.placeOnChart(chart);

    if(chart) {
      let visibleObjectsLayer = chart!.getLayer('visibleObjects');
      this.layer = visibleObjectsLayer;

      visibleObjectsLayer.add(this.border);
      visibleObjectsLayer.add(this.axisShape);

      this.updateAxisSize();
    }
  }

  private updateAxisSize() {

  }
}

(function (window) {
    var AxisBase = function (location, range, size, orientation) {

    }

    AxisBase.prototype = new ChartRenderableItem();

    var p = AxisBase.prototype;

    p.location = null;
    p.range = null;
    p.size = null;
    p._actualSize = null;
    p._orientation = null;

    p._ticksOnScreen = null;

    p.font = null;
    p.fontHeight = 15;
    p.foregroundColor = null;
    p.backgroundColor = null;
    p.majorTickHeight = null;
    p.minorTickHeight = null;
    p.drawBorder = null;

    p.chartLayer = null;

    p.compositeShape = null;
    p.border = null;

    p._attachBase = p.attach;

    p.attach = function (renderer) {
        /// <summary>Attaches axis to specified renderer.</summary>
        /// <param name="renderer" type="Renderer">Renderer to attach to.</param>
        this._attachBase(renderer);

        this.initializeFromElement(renderer.getContainer());

        var stage = renderer.getStage();
        var layer = stage.getLayer('visibleObjects');
        this.chartLayer = layer;

        this.update(this.location, this.range, this.size);

        layer.add(this.border);
        layer.add(this.compositeShape);
    }

    p.initializeFromElement = function (element) {
        /// <summary>Initializes specified control from element's style.</summary>
        /// <param name="element" type="Element">Element to inilialize from.</param>

        var foregroundColor = element.getAttribute('data-axis-foreground-color');
        if (foregroundColor != undefined) {
            this.foregroundColor = foregroundColor;
        }

        var font = element.getAttribute('data-axis-font');
        if (font != undefined) {
            this.font = font;
        }

        var fontHeight = element.getAttribute('data-axis-font-height');
        if (fontHeight != undefined) {
            this.fontHeight = parseFloat(fontHeight);
        }

        var backgroundColor = element.getAttribute('data-axis-background-color');
        if (backgroundColor != undefined) {
            this.backgroundColor = backgroundColor;
        }

        var majorTickHeight = element.getAttribute('data-axis-major-tick-height');
        if (majorTickHeight != undefined) {
            this.majorTickHeight = parseFloat(majorTickHeight);
        }

        var minorTickHeight = element.getAttribute('data-axis-minor-tick-height');
        if (minorTickHeight != undefined) {
            this.minorTickHeight = parseFloat(minorTickHeight);
        }

        var drawBorder = element.getAttribute('data-axis-draw-border');
        if (drawBorder != undefined) {
            this.drawBorder = drawBorder == "true" ? true : false;
        }
    }

    p.update = function (location, range, size) {
        /// <summary>Updates axis state.</summary>
        /// <param name="location" type="Point">NumericAxis location.</param>
        /// <param name="range" type="Range">NumericAxis range.</param>
        /// <param name="size" type="Size">NumericAxis size.</param>
        this.location = location;
        this.range = range;
        this.size = size;
        this._actualSize = new Size(size.width, size.height);
    }

    p.getActualWidth = function () {
        /// <summary>Returns axis actual width.</summary>
        /// <returns type="Number" />
        return this._actualSize.width;
    }

    p.getActualHeight = function () {
        /// <summary>Returns axis actual height.</summary>
        /// <returns type="Number" />
        return this._actualSize.height;
    }

    p.getOrientation = function () {
        /// <summary>Returns axis orientation.</summary>
        /// <returns type="Number" />
        return this._orientation;
    }

    p._detachBase = p.detach;

    p.detach = function (renderer) {
        /// <summary>Detaches axis from renderer.</summary>
        /// <param name="renderer" type="Renderer">Renderer to detach from.</param>
        this._detachBase(renderer);
        var stage = renderer.getStage();
        var layer = stage.getLayer('visibleObjects');
        layer.remove(this.compositeShape);
        layer.remove(this.border);
    }

    p.getDependantLayers = function () {
        /// <summary>Returns axis dependant layers.</summary>
        /// <returns type="Array" />
        return new Array("visibleObjects");
    }

    p.getCoordinateFromTick = function (tick, screenWidth, screenHeight, range) {
        /// <summary>Returns tick's coordinate.</summary>
        if (this._orientation == Orientation.Horizontal)
            return CoordinateTransform.dataToScreenX(tick, range, screenWidth);
        else
            return CoordinateTransform.dataToScreenY(tick, range, screenHeight);
    }

    p.getScreenTicks = function () {
        return this._ticksOnScreen;
    }

    p._generateLabelSizeInternal = function (label, context) {
        /// <summary>Generates label's size for specified tick.</summary>
        /// <param name="label" type="String">Label to measure.</param>
        /// <param name="context" type="Context">Context to use.</param>
        context.font = this.font;

        var width = context.measureText(label).width;
        var height = this.fontHeight;

        var labelSize = new Size(width, height);

        return labelSize;
    }


    window.AxisBase = AxisBase;

}(window));
