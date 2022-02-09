import { createReducer } from "typesafe-actions";
import {IProfileFeedState, ProfileActions, profileFeedDefaultState} from "../../types/profileType";

const initialState: IProfileFeedState = profileFeedDefaultState;

const feed = createReducer<IProfileFeedState,ProfileActions>(initialState,{
  "profile/SET_PROFILE_FEED_DATA": (state, {payload}) => {
    console.log("SET_PROFILE_FEED_DATA payload:", payload)
    return {...payload}
  }
});


export default feed;