import merge from "lodash-es/merge";
import Konva from "konva";
import {NumericPoint, Size} from "../geometry";
import {FontHelper, TextMeasureUtils} from "../services";
import {LayerId} from "../layer-id";
import {HorizontalAlignment} from "../alignment";
import {ChartRenderableItem} from "./chart-renderable-item";
import {cloneDeep} from "lodash-es";
import {LabelOptions, LabelOptionsDefaults} from "../options/plot/label-options";

export class Label extends ChartRenderableItem<Konva.Shape> {
  private location: NumericPoint;
  private width: number;
  private options: LabelOptions;

  private textSize: Size;
  private textTopBottomOffset: number;

  protected layerId: string;

  private labelShape: Konva.Shape;

  public get height() {
    return this.textSize.height + this.textTopBottomOffset * 2;
  }

  constructor(location: NumericPoint, width: number, options: LabelOptions,
              private textMeasureUtils: TextMeasureUtils = TextMeasureUtils.Instance) {
    super();
    this.location = location;
    this.width = width;
    this.options = merge(cloneDeep(LabelOptionsDefaults.Instance), options);

    let self = this;

    this.textSize = this.textMeasureUtils!.measureTextSize(this.options.font!, this.options.text);
    this.textTopBottomOffset = this.textSize.height * 0.214 + (this.options.verticalPadding ?? 0);

    this.labelShape = new Konva.Shape({
      width: this.width,
      textSize: this.textSize,
      textTopBottomOffset: this.textTopBottomOffset,
      sceneFunc: function (context: Konva.Context, shape: Konva.Shape) {

        context.setAttr('font', FontHelper.fontToString(self.options?.font!));
        context.setAttr('textBaseline', 'top');
        context.setAttr('strokeStyle', self.options.foregroundColor!.toString());
        context.setAttr('fillStyle', self.options.foregroundColor!.toString());

        let x = self.location.x;
        let y = self.location.y;

        if (self.options.textAlignment == HorizontalAlignment.Center) {
          x += self.width / 2 - self.textSize.width / 2;
        }

        y += self.textTopBottomOffset;

        context.fillText(self.options.text, x, y);
      }
    })

    this.konvaDrawables = [this.labelShape];

    this.layerId = LayerId.Labels
  }

  /**
   * Sets location and width of this label
   * @param {NumericPoint} location - Label location on the canvas.
   * @param {number} width - Label render width.
   */
  update(location: NumericPoint, width: number) {
    this.location = location;
    this.width = width;

    this.updateLabelShape();
  }

  private updateLabelShape() {
    this.labelShape.setAttrs({
      width: this.width,
      textSize: this.textSize,
      textTopBottomOffset: this.textTopBottomOffset
    });
  }
}
