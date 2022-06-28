import {FontHelper, TextMeasureUtils} from "../services";
import {LabelOptions, LabelOptionsDefaults} from "../options";
import extend from "lodash-es/extend";
import Konva from "konva";
import {ChartRenderableItem} from "../core";
import {HorizontalAlignment, NumericPoint, Size} from "../model";
import {inject} from "tsyringe";
import {LayerName} from "../plot-base";

export class Label extends ChartRenderableItem {
  private location: NumericPoint;
  private size: Size;
  private options: LabelOptions;

  private textSize: Size;
  private textTopOffset: number;

  private shape: Konva.Shape;

  constructor(location: NumericPoint, size: Size, options: LabelOptions,
              @inject("TextMeasureUtils") private textMeasureUtils?: TextMeasureUtils) {
    super();
    this.location = location;
    this.size = size;
    this.options = extend(LabelOptionsDefaults.Instance, options);

    let self = this;

    this.textSize = this.textMeasureUtils!.measureTextSize(this.options.font, this.options.text);
    this.textTopOffset = this.textSize.height * 0.214 + this.options.verticalPadding;

    this.shape = new Konva.Shape({
      stroke: this.options.foregroundColor,
      fill: this.options.foregroundColor,
      sceneFunc: function (context: Konva.Context, shape: Konva.Shape) {

        context.setAttr('font', FontHelper.fontToString(self.options?.font!));
        context.setAttr('textBaseline', 'top');

        context.measureText(self.options.text).width;

        let x = self.location.x;
        let y = self.location.y;

        if (self.options.textAlignment == HorizontalAlignment.Center) {
          x += self.size.width / 2 - self.textSize.width / 2;
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
