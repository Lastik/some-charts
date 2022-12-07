import {Skin} from "./skin";
import {cloneDeep} from "lodash-es";

export interface SkinOptions { }

export interface MajorOptions { }

export abstract class OptionsDefaults<SkinOptionsType extends SkinOptions, MajorOptionsType extends MajorOptions | undefined,
  OptionsType extends (MajorOptionsType extends undefined ? SkinOptionsType : SkinOptionsType & MajorOptionsType)> {
  public abstract get skins(): { [key: string]: SkinOptionsType };

  public abstract majorOptions: MajorOptionsType;

  public applyTo(options: OptionsType, skin: Skin, majorOptions: MajorOptionsType | undefined = undefined): OptionsType {
    return {...(majorOptions ? cloneDeep(majorOptions) : {}), ...cloneDeep(this.skins[skin]), ...cloneDeep(options)};
  }
}
