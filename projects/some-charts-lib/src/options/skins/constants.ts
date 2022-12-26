import {Skin} from "../skin";

export interface Constants {
  foregroundColor: string;
  backgroundColor: string;
  fontFamily: string;
}

export class ConstantsDefaults {

  private readonly fontFamily: string = 'Calibri'

  private constructor() {
  }

  public readonly bySkin: { [key: string]: Constants } = {
    [Skin.Default]: {
      foregroundColor: 'white',
      backgroundColor: '#303030',
      fontFamily: this.fontFamily
    },
    [Skin.Light]: {
      foregroundColor: '#464646',
      backgroundColor: 'white',
      fontFamily: this.fontFamily
    },
  }

  public static readonly Instance = new ConstantsDefaults();
}
