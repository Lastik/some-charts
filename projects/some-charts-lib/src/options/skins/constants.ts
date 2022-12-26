import {Skin} from "../skin";

export interface Constants {
  foregroundColor: string;
  backgroundColor: string;
  outerBorderColor?: string;
  gridColor: string;
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
      outerBorderColor: 'black',
      gridColor: 'white',
      fontFamily: this.fontFamily
    },
    [Skin.Light]: {
      foregroundColor: '#464646',
      backgroundColor: 'white',
      gridColor: '#b3b3b3',
      fontFamily: this.fontFamily
    },
  }

  public static readonly Instance = new ConstantsDefaults();
}
