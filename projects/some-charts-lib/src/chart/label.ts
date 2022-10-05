import extend from "lodash-es/extend";
import Konva from "konva";
import {NumericPoint, Size} from "../geometry";
import {LabelOptions, LabelOptionsDefaults} from "../options";
import {FontHelper, TextMeasureUtils} from "../services";
import {LayerId} from "../layer-id";
import {HorizontalAlignment} from "../alignment";
import {ChartRenderableItem} from "./chart-renderable-item";

export class Label extends ChartRenderableItem<Konva.Shape>{
  private location: NumericPoint;
  private width: number;
  private options: LabelOptions;

  private textSize: Size;
  private textTopOffset: number;

  protected konvaDrawable: Konva.Shape;
  protected layerId: string;

  public get height(){
    return this.textSize.height + this.textTopOffset + (this.options.verticalPadding ?? 0);
  }

  constructor(location: NumericPoint, width: number, options: LabelOptions,
              private textMeasureUtils: TextMeasureUtils = TextMeasureUtils.Instance) {
    super();
    this.location = location;
    this.width = width;
    this.options = extend(LabelOptionsDefaults.Instance, options);

    let self = this;

    this.textSize = this.textMeasureUtils!.measureTextSize(this.options.font!, this.options.text);
    this.textTopOffset = this.textSize.height * 0.214 + (this.options.verticalPadding ?? 0);

    this.konvaDrawable = new Konva.Shape({
      sceneFunc: function (context: Konva.Context, shape: Konva.Shape) {

        context.setAttr('font', FontHelper.fontToString(self.options?.font!));
        context.setAttr('textBaseline', 'top');
        context.setAttr('strokeStyle', self.options.foregroundColor!.toString());
        context.setAttr('fillStyle', self.options.foregroundColor!.toString());

        context.measureText(self.options.text).width;

        let x = self.location.x;
        let y = self.location.y;

        if (self.options.textAlignment == HorizontalAlignment.Center) {
          x += self.width / 2 - self.textSize.width / 2;
        }

        y += self.textSize.height / 2 + self.textTopOffset;

        context.fillText(self.options.text, x, y);

        self.isDirty = false;
      }
    });
  }

  getDependantLayers(): Array<string> {
    return Array(LayerId.Labels);
  }
}
