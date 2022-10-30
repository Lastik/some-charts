import {PlotDrawableElement} from "../plot-drawable-element";
import Konva from "konva";
import {NumericDataRect, DataTransformation, NumericPoint} from "../../../geometry";
import {TextMeasureUtils} from "../../../services";
import {Font} from "../../../font";

export class Bar extends PlotDrawableElement<Konva.Group>{

  constructor(dataPoint: NumericPoint,
              private bounds: NumericDataRect,
              private readonly font: Font,
              rootDrawable: Konva.Group,
              private readonly boundsShape: Konva.Rect,
              private readonly textShape: Konva.Text | undefined,
              private textMeasureUtils: TextMeasureUtils = TextMeasureUtils.Instance) {
    super(dataPoint, rootDrawable);
    this.setBarBounds(bounds);
  }

  override update(dataTransformation: DataTransformation, visible: NumericDataRect, screen: NumericDataRect) {
    super.update(dataTransformation, visible, screen);
    this.updateBarShapes(dataTransformation.dataToScreenRegionForRect(this.bounds, visible, screen));
    this.arrangeTextWithinBar();
  }

  public setBarBounds(rect: NumericDataRect) {
    this.bounds = rect;
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
      let textSize = this.textMeasureUtils.measureTextSize(this.font, labelText);

      this.textShape.setAttrs({
        x: -textSize.width / 2,
        y: textSize.height + 2
      });
    }
  }

  override getBoundingRectangle(): NumericDataRect {
    return new NumericDataRect(
      this.dataPoint.x + this.bounds.minX,
      this.dataPoint.x + this.bounds.maxX,
      this.dataPoint.y + this.bounds.minY,
      this.dataPoint.y  + this.bounds.maxY);
  }
}
