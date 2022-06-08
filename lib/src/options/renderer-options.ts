/**
* Chart renderer options
*/
export interface RendererOptions {
  /**
   * Renderer background color.
   */
  backgroundColor?: string;
  /**
   * Renderer border style.
   */
  borderStyle?: string;
}

export class RendererOptionsDefaults
{
  private static _instance: RendererOptions = {
    backgroundColor: "#111111",
    borderStyle: "1px solid #000000"
  }

  public static get Instance()
  {
    return this._instance;
  }
}
