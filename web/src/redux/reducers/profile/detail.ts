import {createReducer} from "typesafe-actions";
import {IProfileDetailState, ProfileActions, profileDetailDefaultState} from "../../types/profileType";

const initialState: IProfileDetailState = profileDetailDefaultState;

const detail = createReducer<IProfileDetailState, ProfileActions>(initialState, {
    "profile/SET_PROFILE_DETAIL_DATA": (state, {payload}) => {
        return {...payload}
    }
});

export default detail;