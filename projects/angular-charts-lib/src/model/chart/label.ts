import extend from "lodash-es/extend";
import Konva from "konva";
import {inject} from "tsyringe";
import {ChartRenderableItem} from "./index";
import {HorizontalAlignment, NumericPoint, Size} from "../index";
import {LabelOptions, LabelOptionsDefaults} from "../index";
import {FontHelper, TextMeasureUtils} from "../../services";
import {LayerName} from "../layer-name";

export class Label extends ChartRenderableItem {
  private location: NumericPoint;
  private width: number;
  private options: LabelOptions;

  private textSize: Size;
  private textTopOffset: number;

  private shape: Konva.Shape;

  public get height(){
    return this.textSize.height + this.textTopOffset + this.options.verticalPadding;
  }

  constructor(location: NumericPoint, width: number, options: LabelOptions,
              @inject("TextMeasureUtils") private textMeasureUtils?: TextMeasureUtils) {
    super();
    this.location = location;
    this.width = width;
    this.options = extend(LabelOptionsDefaults.Instance, options);

    let self = this;

    this.textSize = this.textMeasureUtils!.measureTextSize(this.options.font, this.options.text);
    this.textTopOffset = this.textSize.height * 0.214 + this.options.verticalPadding;

    this.shape = new Konva.Shape({
      stroke: this.options.foregroundColor.toString(),
      fill: this.options.foregroundColor.toString(),
      sceneFunc: function (context: Konva.Context, shape: Konva.Shape) {

        context.setAttr('font', FontHelper.fontToString(self.options?.font!));
        context.setAttr('textBaseline', 'top');

        context.measureText(self.options.text).width;

        let x = self.location.x;
        let y = self.location.y;

        if (self.options.textAlignment == HorizontalAlignment.Center) {
          x += self.width / 2 - self.textSize.width / 2;
        }

        y += self.textSize.height / 2 + self.textTopOffset;

        context.fillText(self.options.text, x, y);
      }
    });
  }

  getDependantLayers(): Array<string> {
    return Array(LayerName.Labels);
  }
}
