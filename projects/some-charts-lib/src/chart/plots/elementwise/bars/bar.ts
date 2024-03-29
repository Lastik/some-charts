import {PlotDrawableElement} from "../plot-drawable-element";
import Konva from "konva";
import {NumericDataRect, DataTransformation, NumericPoint} from "../../../../geometry";
import {Font} from "../../../../font";
import {BarsColoring} from "./bars-coloring";
import {AnimatedProperty} from "../../animated-property";
import {TextMeasureUtils} from "../../../../services";
import {Color} from "../../../../color";

export class Bar extends PlotDrawableElement<Konva.Group>{

  private readonly boundsShape: Konva.Rect;
  private readonly textShape: Konva.Text | undefined;

  public relativeBounds: AnimatedProperty<NumericDataRect>;
  private readonly labelFont: Font;

  override get animatedProperties(): Array<AnimatedProperty<any>>{
    return [...super.animatedProperties, this.relativeBounds];
  };

  constructor(metricId: string,
              dataPoint: NumericPoint,
              relativeBounds: NumericDataRect,
              coloring: BarsColoring,
              labelText: string | undefined,
              labelFont: Font,
              labelColor: Color) {
    let root = new Konva.Group();
    super(metricId, dataPoint, root);

    this.relativeBounds = new AnimatedProperty<NumericDataRect>(relativeBounds);
    this.labelFont = labelFont;

    this.boundsShape = new Konva.Rect({
      stroke: coloring.stroke.toString(),
      strokeWidth: 1,
      fillLinearGradientStartPoint: {x: 0, y: 0},
      fillLinearGradientEndPoint: {x: 0, y: 50},
      fillLinearGradientColorStops: [
        0,
        coloring.fillGradient.min.toString(),
        0.4,
        coloring.fillGradient.max.toString(),
        1,
        coloring.fillGradient.max.toString()],
    });
    root.add(this.boundsShape);

    if(labelText) {
      this.textShape = new Konva.Text({
        text: labelText,
        fill: labelColor.toString(),
        fontSize: labelFont.size,
        fontFamily: labelFont.family
      })
      root.add(this.textShape);
    }
  }

  override updateShapesForAnimationFrame(dataPoint: NumericPoint, dataTransformation: DataTransformation, visible: NumericDataRect, screen: NumericDataRect){
    this.updateBarBoundingShape(
      dataTransformation.getRelativeRectLocationOnScreen(dataPoint, this.relativeBounds.displayedValue, visible, screen)
    );
    this.arrangeTextWithinBar();
  }

  private updateBarBoundingShape(barBoundsInScreenCoords: NumericDataRect) {
    this.boundsShape.setAttrs({
      x: barBoundsInScreenCoords.minX,
      y: barBoundsInScreenCoords.minY,
      width: barBoundsInScreenCoords.width,
      height: barBoundsInScreenCoords.height
    })
  }

  public setBarLabelText(text: string) {
    this.textShape?.setAttrs({
      text: text
    })
  }

  private arrangeTextWithinBar() {
    if (this.textShape) {
      let labelText = this.textShape.text();
      let textSize = TextMeasureUtils.measureTextSize(this.labelFont, labelText);

      this.textShape.setAttrs({
        x: -textSize.width / 2,
        y: textSize.height + 2
      });
    }
  }

  override getBoundingRectangle(): NumericDataRect {
    return this.relativeBounds.displayedValue.addOffset(this.dataPoint.displayedValue);
  }
}
