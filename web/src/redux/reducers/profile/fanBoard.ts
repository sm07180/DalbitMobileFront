import { createReducer } from "typesafe-actions";
import {IProfileFanBoardState, ProfileActions, profileFanBoardDefaultState} from "../../types/profileType";

const initialState: IProfileFanBoardState = profileFanBoardDefaultState;

const fanBoard = createReducer<IProfileFanBoardState,ProfileActions>(initialState,{
  "profile/SET_PROFILE_FANBOARD_DATA": (state, {payload}) => {
    console.log("SET_PROFILE_FANBOARD_DATA payload:", payload)
    return {...payload}
  }
});


export default fanBoard;