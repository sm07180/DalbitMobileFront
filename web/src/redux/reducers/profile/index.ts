import { createReducer } from "typesafe-actions";
import {IProfileState, ProfileActions, profileDefaultState,} from "../../types/profileType";

const initialState: IProfileState = profileDefaultState;

const profile = createReducer<IProfileState,ProfileActions>(initialState,{
  "profile/SET_PROFILE_DATA": (state, {payload}) => {
    console.log("SET_PROFILE_DATA payload:", payload)
    return {...payload}
  }
});


export default profile;

