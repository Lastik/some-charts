import {Skin} from "../skin";

export interface Constants {
  foregroundColor: string;
  backgroundColor: string;
  outerBorderColor?: string;
  fontFamily: string;
}

let fontFamily = 'Calibri';

let ConstantsDefaults = {
  fontFamily,
  bySkin: {
    [Skin.Default]: {
      foregroundColor: '#464646',
      backgroundColor: 'white',
      fontFamily: fontFamily,
      outerBorderColor: 'black',
    },
    [Skin.Dark]: {
      foregroundColor: 'white',
      backgroundColor: '#303030',
      fontFamily: fontFamily,
    },
  }
}

export {ConstantsDefaults as ConstantsDefaults}
