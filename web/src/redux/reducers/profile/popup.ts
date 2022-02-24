import { createReducer } from "typesafe-actions";
import {IProfilePopupState, ProfileActions} from "../../types/profileType";

const initialState: IProfilePopupState = {
  headerPopup: false,
  fanStarPopup: false,
  likePopup: false,
  blockReportPopup: false,
  presentPopup: false,
  questionMarkPopup: false,
  historyPopup: false,
}

const profilePopup = createReducer<IProfilePopupState, ProfileActions>(initialState, {
  "profile/SET_PROFILE_POPUP_OPEN_DATA": (state, {payload}) => {
    return {...payload}
  },
  "profile/SET_PROFILE_POPUP_CLOSE": () => {
    return {...initialState}
  }
});

export default profilePopup;
