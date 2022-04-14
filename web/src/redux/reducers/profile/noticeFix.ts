import {createReducer} from "typesafe-actions";
import {IProfileNoticeFixState, ProfileActions, profileNoticeFixDefaultState} from "../../types/profileType";

const initialState: IProfileNoticeFixState = profileNoticeFixDefaultState;

const noticeFix = createReducer<IProfileNoticeFixState, ProfileActions>(initialState, {
    "profile/SET_PROFILE_NOTICE_FIX_DATA": (state, {payload}) => {
        return {...payload}
    }
});

export default noticeFix;