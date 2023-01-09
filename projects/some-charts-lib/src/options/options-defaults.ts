import {Skin} from "./skin";
import {cloneDeep} from "lodash-es";
import {Constants, ConstantsDefaults} from "./skins";

export interface SkinOptions { }

export interface MajorOptions { }

export abstract class OptionsDefaults<SkinOptionsType extends SkinOptions, MajorOptionsType extends MajorOptions | undefined,
  OptionsType extends (MajorOptionsType extends undefined ? SkinOptionsType : SkinOptionsType & MajorOptionsType)> {

  protected constructor(
    protected constantsDefaults: ConstantsDefaults = ConstantsDefaults.Instance,
    protected defaultSkinConsts: Constants = constantsDefaults.bySkin[Skin.Default],
    protected darkSkinConsts: Constants = constantsDefaults.bySkin[Skin.Dark],
    protected lightSkinConsts: Constants = defaultSkinConsts
  ) {
  }

  protected abstract get skins(): { [key: string]: SkinOptionsType };

  public get defaultSkin(): SkinOptionsType {
    return this.skins[Skin.Default];
  }

  protected abstract majorOptions: MajorOptionsType;

  public extendWith<DerivedOptionsType extends OptionsType>(options: DerivedOptionsType | undefined, skin: Skin = Skin.Default): DerivedOptionsType {
    return {
      ...(this.majorOptions ? cloneDeep(this.majorOptions) : {}),
      ...cloneDeep(this.skins[Skin.Default]),
      ...cloneDeep(this.skins[skin] ?? this.skins[Skin.Default]),
      ...(options ? cloneDeep(options) : {})
    } as DerivedOptionsType;
  }
}
