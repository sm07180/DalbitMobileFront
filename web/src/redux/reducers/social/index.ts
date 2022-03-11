import {createReducer} from "typesafe-actions";
import {SocialState, SocialActions} from "../../types/socialType";

const initailState:SocialState = {
    tab: "피드"
}

const social = createReducer<SocialState, SocialActions>(initailState, {
    "social/SET_SOCIAL_TAB": (state, {payload}) => {
        return {tab: payload}
    }
});

export default social;