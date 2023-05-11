/**
 * Contains common utility methods.
 */
class UagentUtils {

  /**
   * Lowered user agent.
   */
  private readonly uagent: string = navigator.userAgent.toLowerCase();
  /**
   * True if is IE.
   */
  public readonly isMsIE: boolean = /MSIE (\d+\.\d+);/.test(navigator.userAgent);
  /**
   * True if is firefox
   */
  public readonly isFirefox: boolean = this.uagent.indexOf("firefox") > -1;
  /**
   * True if is iphone
   */
  public readonly isIphone: boolean = this.uagent.indexOf("iphone") > -1;
  /**
   * True if device is ipad
   */
  public readonly isIpad: boolean = this.uagent.indexOf("ipad") > -1;
  /**
   * True if device is ipod
   */
  public readonly isIpod: boolean = this.uagent.indexOf("ipod") > -1;
  /**
   * True if device is android
   */
  public readonly isAndroid = this.uagent.indexOf("android") > -1;
}


const uagentUtils = new UagentUtils();

export {uagentUtils as UagentUtils};
