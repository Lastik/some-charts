import {PlotKind} from "../../options";

export class PlotErrorBuilder {
  buildPlotDoesntSupport2DRendering(plotKind: PlotKind) {
    return new Error(`${plotKind} plot doesn't support 2D rendering`);
  }

  public static readonly Instance = new PlotErrorBuilder();
}
