import { createReducer } from "typesafe-actions";
import {IProfileClipState, ProfileActions, profileClipDefaultState} from "../../types/profileType";

const initialState: IProfileClipState = profileClipDefaultState;

const profileClip = createReducer<IProfileClipState,ProfileActions>(initialState,{
  "profile/SET_PROFILE_CLIP_DATA": (state, {payload}) => {
    return {...payload}
  }
});

export default profileClip;