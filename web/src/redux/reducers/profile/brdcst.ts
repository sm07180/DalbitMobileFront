import { createReducer } from "typesafe-actions";
import {IProfileNoticeState, ProfileActions, profileNoticeDefaultState} from "../../types/profileType";

const initialState: IProfileNoticeState = profileNoticeDefaultState;

const brdcst = createReducer<IProfileNoticeState,ProfileActions>(initialState,{
  "profile/SET_PROFILE_NOTICE_DATA": (state, {payload}) => {
    return {...payload}
  }
});


export default brdcst;