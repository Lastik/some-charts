import {Palette} from "../../chart/plots";
import * as Color from "color";

export interface MetricOptions<ColorType extends Color | Palette> {
  /**
   * Metric id.
   * */
  id: string;
  /**
   * Metric caption.
   * */
  caption: string;
  /**
   * Metric color or palette (see {@link Color} and {@link Palette}).
   * */
  color: ColorType
}
