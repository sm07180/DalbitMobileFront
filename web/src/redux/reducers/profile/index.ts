import { createReducer } from "typesafe-actions";
import {IProfileState, ProfileActions, profileDefaultState,} from "../../types/profileType";

const initialState: IProfileState = profileDefaultState;

const profile = createReducer<IProfileState,ProfileActions>(initialState,{
  "profile/SET_PROFILE_DATA": (state, {payload}) => {
    console.log(payload);
    
    return {...payload}
  }
});


export default profile;

