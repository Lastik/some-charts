import {Skin} from "./skin";
import {cloneDeep} from "lodash-es";

export interface SkinOptions { }

export interface MajorOptions { }

export abstract class OptionsDefaults<SkinOptionsType extends SkinOptions, MajorOptionsType extends MajorOptions | undefined,
  OptionsType extends (MajorOptionsType extends undefined ? SkinOptionsType : SkinOptionsType & MajorOptionsType)> {
  public abstract get skins(): { [key: string]: SkinOptionsType };

  public abstract majorOptions: MajorOptionsType;

  public applyTo(options: OptionsType | undefined, skin: Skin): OptionsType {
    return {...(this.majorOptions ? cloneDeep(this.majorOptions) : {}), ...cloneDeep(this.skins[skin]), ...(options ? cloneDeep(options) : {})} as OptionsType;
  }
}
