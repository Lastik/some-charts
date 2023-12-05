import {Skin} from "../skin";
import {Color} from "../../color";

export interface Constants {
  foregroundColor: Color;
  backgroundColor: Color;
  outerBorderColor?: Color;
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
    } as Constants,
    [Skin.Dark]: {
      foregroundColor: 'white',
      backgroundColor: '#303030',
      fontFamily: fontFamily,
    } as Constants,
  }
}

export {ConstantsDefaults as ConstantsDefaults}
