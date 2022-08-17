/**
 * Contains common utility methods.
 */
export class UagentUtils {

  /**
   * Lowered user agent.
   */
  private static readonly uagent: string = navigator.userAgent.toLowerCase();
  /**
   * True if is IE.
   */
  public static readonly isMsIE: boolean = /MSIE (\d+\.\d+);/.test(navigator.userAgent);
  /**
   * True if is firefox
   */
  public static readonly isFirefox: boolean = UagentUtils.uagent.indexOf("firefox") > -1;
  /**
   * True if is iphone
   */
  public static readonly isIphone: boolean = UagentUtils.uagent.indexOf("iphone") > -1;
  /**
   * True if device is ipad
   */
  public static readonly isIpad: boolean = UagentUtils.uagent.indexOf("ipad") > -1;
  /**
   * True if device is ipod
   */
  public static readonly isIpod: boolean = UagentUtils.uagent.indexOf("ipod") > -1;
  /**
   * True if device is android
   */
  public static readonly isAndroid = UagentUtils.uagent.indexOf("android") > -1;
}
