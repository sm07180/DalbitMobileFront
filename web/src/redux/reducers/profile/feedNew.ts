import {createReducer} from "typesafe-actions";
import {IProfileFeedNewState, ProfileActions, profileFeedNewDefaultState} from "../../types/profileType";

const initialState: IProfileFeedNewState = profileFeedNewDefaultState;

const feedNew = createReducer<IProfileFeedNewState, ProfileActions>(initialState, {
    "profile/SET_PROFILE_FEED_NEW_DATA": (state, {payload}) => {
        return {...payload}
    }
});

export default feedNew;