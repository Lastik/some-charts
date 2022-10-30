import {PlotDrawableElement} from "../plot-drawable-element";
import Konva from "konva";
import {NumericDataRect, DataTransformation, NumericPoint} from "../../../geometry";
import {TextMeasureUtils} from "../../../services";

export class Bar extends PlotDrawableElement<Konva.Group>{

  constructor(dataPoint: NumericPoint,
              private bounds: NumericDataRect,
              konvaDrawable: Konva.Group,
              private readonly boundsShape: Konva.Rect,
              private readonly textShape: Konva.Text | undefined,
              private textMeasureUtils: TextMeasureUtils = TextMeasureUtils.Instance) {
    super(dataPoint, konvaDrawable);
    this.setBarBounds(bounds);
  }

  override update(dataTransformation: DataTransformation, visible: NumericDataRect, screen: NumericDataRect) {
    super.update(dataTransformation, visible, screen);
    this.updateBarShapes(dataTransformation.dataToScreenRegionForRect(this.bounds, visible, screen));
    this.arrangeTextWithinBar();
  }

  public setBarBounds(rect: NumericDataRect) {
    this.bounds = rect;
/*
    this.konvaDrawable.clipFunc((ctx) => {
      if (bounds) {
        ctx.bounds(0, 0, bounds.width, bounds.height);
      }
    });*/
  }

  private updateBarShapes(barBoundsInScreenCoords: NumericDataRect) {
    this.boundsShape.setAttrs({
      x: barBoundsInScreenCoords.minX,
      y: barBoundsInScreenCoords.minY,
      width: barBoundsInScreenCoords.width,
      height: barBoundsInScreenCoords.height
    })
  }

  public setBarLabel(label: string) {
    this.textShape?.setAttrs({
      text: label
    })
  }

  protected arrangeTextWithinBar() {
    if (this.textShape) {
      let labelText = this.textShape.text();
      let textWidth = this.textMeasureUtils.measureTextWidth(this.textShape.getAttr('font'), labelText);
      let textHeight = this.textMeasureUtils.measureTextHeight(this.textShape.getAttr('font'));

      this.textShape.setAttrs({
        x: -textWidth / 2,
        y: textHeight + 2
      });
    }
  }
}
