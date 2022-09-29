import {PlotDrawableElement} from "../plot-drawable-element";
import Konva from "konva";
import {DataRect, DataTransformation, NumericPoint} from "../../../geometry";

export class BarsPlotDrawableElement extends PlotDrawableElement{

  public readonly rectShape: Konva.Rect;
  public readonly textShape: Konva.Text | undefined;

  constructor(dataPoint: NumericPoint, konvaDrawable: Konva.Group | Konva.Shape, rectShape: Konva.Rect, textShape: Konva.Text | undefined) {
    super(dataPoint, konvaDrawable);
    this.rectShape = rectShape;
    this.textShape = textShape;
  }

  override update(dataTransformation: DataTransformation, visible: DataRect, screen: DataRect) {
    super.update(dataTransformation, visible, screen);
    PlotDrawableElement.scaleKonvaRect(this.rectShape, dataTransformation, visible, screen);
  }
}
