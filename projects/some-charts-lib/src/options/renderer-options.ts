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
  public static readonly Instance:  RendererOptions = {
    backgroundColor: "#111111",
    borderStyle: "1px solid #000000"
  }
}
